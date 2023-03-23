import https from 'https';
import zlib from 'zlib';

export const WEB_HOOKS = {
  DDL: process.env.DDL,
  SLOW: {
    inflearn: process.env.INFLEARN_SLOW,
    rallit: process.env.RALLIT_SLOW,
  },
  ERROR: {
    inflearn: process.env.INFLEARN_ERROR,
    rallit: process.env.RALLIT_ERROR,
  },
};

const SLOW_LIMIT = 3;

export const handler = async (event, context) => {
  zlib.gunzip(Buffer.from(event.awslogs.data, 'base64'), async (e, result) => {
    if (e) {
      context.fail(e);
    }

    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
    const { logEvents, logStream } = JSON.parse(result);
    console.log(`logEvents: \n${JSON.stringify(logEvents)}`);
    console.log(`logEvents count=${logEvents.length}`);

    try {
      const successCount = await sendMessages(logEvents, logStream);
      console.log(`[Response] 전체 ${successCount} 건 전송 완료`);
    } catch (e) {
      console.log('slack message fail:', e);
      context.fail(e);
    }
  });
};

export async function sendMessages(logEvents, logStream) {
  const messages = logEvents
    ?.map((event) => new Message(event, logStream))
    .filter((message) => message.isSendable);

  console.log(`messages count=${messages.length}`);

  const results = await Promise.allSettled(
    messages.map(async (message) => {
      await send(slackMessage(message), message.webhook);
    }),
  );

  results
    .filter((result) => result.status === 'rejected')
    .map((fail) => console.log(`sendMessage 실패: ${fail.value}`));

  return results.filter((result) => result.status === 'fulfilled').length;
}

const SERVICE_TYPE = {
  INFLEARN: 'INFLEARN',
  RALLIT: 'RALLIT',
};
export class Message {
  constructor({ message, timestamp }, logStream) {
    this._message = message;
    this.currentTime = new KstTime(timestamp).time;
    this.logLocation = logStream;
    this.userIp = message.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0];
    this.user = message.match(/:\w+@\w+:/)[0].slice(1, -1);
    this.pid = message.match(/:\[\d+]/)[0].slice(2, -1);
    this.queryTime = this.getQueryTime(message);
    this.query = message.match(/(?:ERROR|LOG|STATEMENT):\s+(?:.*:\s+)?(.+)/)[1];
  }

  getQueryTime(message) {
    const match = message.match(/duration: \d+\.\d+ ms/);

    if (!match || match.length === 0) {
      return 0;
    }

    return (Number(match[0].match(/\d+\.\d+/)[0]) / 1000).toFixed(3);
  }

  get service() {
    return this.user.includes('@rallit')
      ? SERVICE_TYPE.RALLIT
      : SERVICE_TYPE.INFLEARN;
  }

  get type() {
    if (
      this.query.includes('create table') ||
      this.query.includes('drop table') ||
      this.query.includes('alter table')
    ) {
      return 'DDL';
    }

    return this._message.match(/ERROR:\s+(?:.*:\s+)?(.+)/) ? 'ERROR' : 'SLOW';
  }

  get isSendable() {
    if (this.query.includes('Query Text:')) {
      return false;
    }

    return this.queryTime >= SLOW_LIMIT || this.type !== 'SLOW';
  }
  get webhook() {
    if (this.type === 'DDL') {
      return WEB_HOOKS.DDL;
    }

    if (this.type === 'ERROR') {
      return this.service === SERVICE_TYPE.INFLEARN
        ? WEB_HOOKS.ERROR.inflearn
        : WEB_HOOKS.ERROR.rallit;
    }

    return this.service === SERVICE_TYPE.INFLEARN
      ? WEB_HOOKS.SLOW.inflearn
      : WEB_HOOKS.SLOW.rallit;
  }
}

export class KstTime {
  /**
   * @param timestamp {number}
   */
  constructor(timestamp) {
    const kst = new Date(timestamp + 32400000);
    this.time = `${kst.getFullYear().toString()}-${this.pad(
      kst.getMonth() + 1,
    )}-${this.pad(kst.getDate())} ${this.pad(kst.getHours())}:${this.pad(
      kst.getMinutes(),
    )}:${this.pad(kst.getSeconds())}`;
  }

  pad(n) {
    return n < 10 ? '0' + n : n;
  }
}

/** @param message {Message} */
export function slackMessage(message) {
  const title = `[${message.type} 쿼리]`;
  const payload = `언제: ${message.currentTime}\n서비스:${message.service}\n로그위치:${message.logLocation}\n사용자: ${message.user}\n사용자IP: ${message.userIp}\npid: ${message.pid}\n수행시간: ${message.queryTime} 초\n쿼리/메세지: ${message.query}`;

  const color = message.type === 'DDL' ? '#2eb886' : '#FF0000';

  return {
    attachments: [
      {
        color: color,
        title: title,
        fields: [
          {
            value: payload,
            short: false,
          },
        ],
      },
    ],
  };
}

export async function send(message, webhook) {
  try {
    const { host, pathname } = new URL(webhook);
    const options = {
      hostname: host,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(
      `[Slack 발송 시도] message=${JSON.stringify(
        message,
      )}, webhook=${webhook}`,
    );
    await request(options, message);
    console.log(`[Slack 발송 성공] message=${JSON.stringify(message)}`);
  } catch (e) {
    console.log(
      `[Slack 발송 실패] message=${JSON.stringify(
        message,
      )}, webhook=${webhook}`,
      e,
    );
    throw e;
  }
}

export async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(rawData);
        } catch (err) {
          console.log(`res.on(end) Error`, err);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

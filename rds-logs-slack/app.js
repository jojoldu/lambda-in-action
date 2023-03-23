import https from 'https';
import zlib from 'zlib';

const WEB_HOOKS = {
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

    const { logEvents, logStream } = JSON.parse(result);
    console.log(`logEvents count=${logEvents.length}`);

    const messages = logEvents
      ?.map((event) => new Message(event, logStream))
      .filter((message) => message.isSendable);

    console.log(`messages count=${messages.length}`);

    await Promise.all(
      messages.map(
        async (message) => await send(slackMessage(message), message.webhook),
      ),
    ).catch((error) => {
      console.error('slack message fail:', error);
    });
  });
};

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
    this.query = message.match(/(?:ERROR|LOG):\s+(?:.*:\s+)?(.+)/)[1];
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
  const payload = `언제: ${message.currentTime}\n
  Service:${message.service}\n
  Log Location:${message.logLocation}\n
  User: ${message.user}\n
  UserIP: ${message.userIp}\n
  pid: ${message.pid}\n
  QueryTime: ${message.queryTime} 초\n
  Query: ${message.query}`;

  return {
    attachments: [
      {
        color: '#2eb886',
        title: `${title}`,
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
  const { host, pathname } = new URL(webhook);
  const options = {
    hostname: host,
    path: pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    console.log(
      `[Slack 발송 시도] message=${JSON.stringify(
        message,
      )}, webhook=${webhook}`,
    );
    await request(options, message);
  } catch (e) {
    console.error(`[Slack 발송 실패] message=${message}`, e);
    throw e;
  }
}

export async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(responseBody);
      });
    });

    req.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

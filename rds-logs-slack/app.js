import https from 'https';
import zlib from 'zlib';

const webhooks = {
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

export const handler = async (event, context) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  zlib.gunzip(Buffer.from(event.awslogs.data, 'base64'), async (e, result) => {
    if (e) {
      context.fail(e);
    }

    const { logEvents, logStream } = JSON.parse(result);
    const messages = logEvents?.map((event) => new Message(event, logStream));
    console.log(`MESSAGES: \n${JSON.stringify(messages)}`);
  });
};

export class Message {
  constructor({ message, timestamp }, logStream) {
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
      return '알 수 없음';
    }

    return `${(Number(match[0].match(/\d+\.\d+/)[0]) / 1000).toFixed(3)}초`;
  }

  get service() {
    return this.user.includes('@rallit') ? 'RALLIT' : 'INFLEARN';
  }

  get type() {
    return 'SLOW';
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
  QueryTime: ${message.queryTime}\n
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

export async function send(message, slackUrl) {
  const { host, pathname } = new URL(slackUrl);
  const options = {
    hostname: host,
    path: pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
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

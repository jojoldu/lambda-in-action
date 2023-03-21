const https = require('https');
const zlib = require('zlib');

const SLACK_URL = process.env.SLACK_URL;

exports.handler = (input, context) => {
  const payload = Buffer.from(input.awslogs.data, 'base64');
  zlib.gunzip(payload, async (e, result) => {
    if (e) {
      context.fail(e);
    }

    const resultJson = getQueryLog(result, context);
    const messages = resultJson.logEvents.map(
      (event) => new Message(event, resultJson.logStream),
    );
    Promise.all(
      messages.map((message) => send(slackMessage(message), SLACK_URL)),
    ).catch((error) => {
      console.error('slack message fail:', error);
    });
  });
};

/**
 *
 * @param buffer {Buffer}
 * @param context
 * @returns {any}
 */
function getQueryLog(buffer, context) {
  const resultAscii = buffer.toString('ascii');

  console.log(`result json = ${resultAscii}`);

  try {
    return JSON.parse(resultAscii);
  } catch (e) {
    console.error(
      `[ascii 변환 실패] JSON.parse(buffer.toString('ascii')) Fail, resultAscii= ${resultAscii}`,
    );
    context.fail(e);
  }
}

export class Message {
  constructor(logEvent, logLocation) {
    const message = logEvent.message;
    const messages = this.parse(message);
    const timeSplit = messages.length > 6 ? messages[5].trim().split(' ') : [];
    const queryTime =
      timeSplit.length > 1 ? (Number(timeSplit[0]) / 1000).toFixed(3) : 0;
    const querySplit = message.split('<unnamed>:');

    this.currentTime = new KstTime(logEvent.timestamp).time;
    this.logLocation = logLocation;
    this.userIp = messages[0].trim();
    this.user = messages[1].trim();
    this.pid = messages[2].trim().replace('[', '').replace(']', '');
    this.queryTime = queryTime;
    this.query = querySplit[querySplit.length - 1].trim();
  }

  /** @returns {[]}
   * @param message { string } */
  parse(message) {
    const DATE_TIME_REGEX = new RegExp(
      '(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2}) UTC:',
    );
    const removedUtcMessage = message.replace(
      message.match(DATE_TIME_REGEX)[0],
      '',
    );

    return removedUtcMessage.split(':');
  }

  /** @param user {string} */
  getUser(user) {
    return user.includes('@rallit') ? `${user} (랠릿)` : `${user} (인프런)`;
  }
}

export class KstTime {
  /**
   * @param timestamp {number}
   */
  constructor(timestamp) {
    const kstDate = new Date(timestamp + 32400000);
    this.time = `${kstDate.getFullYear().toString()}-${this.pad(
      kstDate.getMonth() + 1,
    )}-${this.pad(kstDate.getDate())} ${this.pad(
      kstDate.getHours(),
    )}:${this.pad(kstDate.getMinutes())}:${this.pad(kstDate.getSeconds())}`;
  }

  pad(n) {
    return n < 10 ? '0' + n : n;
  }
}

export function slackMessage(messageJson) {
  const title = `[DDL 쿼리]`;
  const message = `언제: ${messageJson.currentTime}\n
  로그위치:${messageJson.logLocation}\n
  계정: ${messageJson.user}\n
  계정IP: ${messageJson.userIp}\n
  pid: ${messageJson.pid}\n
  QueryTime: ${messageJson.queryTime}초\n
  쿼리: ${messageJson.query}`;

  return {
    attachments: [
      {
        color: '#2eb886',
        title: `${title}`,
        fields: [
          {
            value: message,
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

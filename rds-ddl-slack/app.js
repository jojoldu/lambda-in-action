// noinspection DuplicatedCode

const https = require('https');
const zlib = require('zlib');

const SLOW_TIME_LIMIT = 3; // 3초이상일 경우 슬랙 발송
const SLACK_URL = '슬랙 Webhook URL';

exports.handler = (input, context) => {
  const payload = Buffer.from(input.awslogs.data, 'base64');
  zlib.gunzip(payload, async (e, result) => {
    if (e) {
      context.fail(e);
    }

    const resultAscii = result.toString('ascii');

    let resultJson;

    try {
      resultJson = JSON.parse(resultAscii);
    } catch (e) {
      console.error(
        `[알람발송실패] JSON.parse(result.toString('ascii')) Fail, resultAscii= ${resultAscii}`,
      );
      context.fail(e);

      return;
    }

    console.log(`result json = ${resultAscii}`);

    for (let i = 0; i < resultJson.logEvents.length; i++) {
      const logJson = new Message(
        resultJson.logEvents[i],
        resultJson.logStream,
      );
      console.log(`logJson=${JSON.stringify(logJson)}`);

      try {
        const message = slackMessage(logJson);

        if (logJson.queryTime > SLOW_TIME_LIMIT) {
          await send(message, SLACK_URL);
        }
      } catch (e) {
        console.log(`slack message fail= ${JSON.stringify(logJson)}`);

        return;
      }
    }
  });
};

const DATE_TIME_REGEX = new RegExp(
  '(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2}) UTC:',
);

/**
 *
 * @returns {[]}
 * @param message { string }
 */
export function convertMessages(message) {
  const removedUtcMessage = message.replace(
    message.match(DATE_TIME_REGEX)[0],
    '',
  );

  return removedUtcMessage.split(':');
}
export class Message {
  constructor(logEvent, logLocation) {
    const message = logEvent.message;
    const messages = convertMessages(message);
    const timeSplit = messages.length > 6 ? messages[5].trim().split(' ') : [];
    const queryTime =
      timeSplit.length > 1 ? (Number(timeSplit[0]) / 1000).toFixed(3) : 0;
    const querySplit = message.split('<unnamed>:');

    this.currentTime = toYyyymmddhhmmss(logEvent.timestamp);
    this.logLocation = logLocation;
    this.userIp = messages[0].trim();
    this.user = messages[1].trim();
    this.pid = messages[2].trim().replace('[', '').replace(']', '');
    this.queryTime = queryTime;
    this.query = querySplit[querySplit.length - 1].trim();
  }
}

// 타임존 UTC -> KST
export function toYyyymmddhhmmss(timestamp) {
  if (!timestamp) {
    return '';
  }

  function pad2(n) {
    return n < 10 ? '0' + n : n;
  }

  const kstDate = new Date(timestamp + 32400000);

  return (
    kstDate.getFullYear().toString() +
    '-' +
    pad2(kstDate.getMonth() + 1) +
    '-' +
    pad2(kstDate.getDate()) +
    ' ' +
    pad2(kstDate.getHours()) +
    ':' +
    pad2(kstDate.getMinutes()) +
    ':' +
    pad2(kstDate.getSeconds())
  );
}

export function slackMessage(messageJson) {
  const title = `[${SLOW_TIME_LIMIT}초이상 실행된 쿼리]`;
  const message = `언제: ${messageJson.currentTime}\n로그위치:${messageJson.logLocation}\n계정: ${messageJson.user}\n계정IP: ${messageJson.userIp}\npid: ${messageJson.pid}\nQueryTime: ${messageJson.queryTime}초\n쿼리: ${messageJson.query}`;

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

  return request(options, message);
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

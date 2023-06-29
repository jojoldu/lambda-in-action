const fs = require('fs');
const https = require('https');

/**
 * Returns an HTML page containing an interactive Web-based
 * tutorial. Visit the function URL to see it and learn how
 * to build with lambda.
 */
exports.handler = async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);

  const id = event.queryStringParameters?.id;
  const host =
    event.queryStringParameters?.env === 'dev'
      ? 'https://www.devinflearn.com'
      : 'https://www.inflearn.com';
  const { title, description } = await getSessionDescription(host, id);
  const html = fs.readFileSync('index.html', { encoding: 'utf8' });

  const body = html
    .replace(/{sessionName}/g, title || '')
    .replace(/{sessionDescription}/g, summarize(description) || '')
    .replace(/{id}/g, id || '')
    .replace(/{host}/g, host);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: body,
  };
};

export function summarize(text) {
  if (!text) {
    return text;
  }

  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  const escapedText = text.replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });

  return escapedText.length > 152 ? escapedText.substring(0, 152) : escapedText;
}

export async function getSessionDescription(domain, id) {
  const { host, pathname } = new URL(`${domain}/api/infcon/pages/${id}`);
  const options = {
    hostname: host,
    path: pathname,
    method: 'GET',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // const response = await request(options, {});
  const response =
    '{"data":{"title":"Kopring(Kotlin + Spring) 프로젝트 투입 1주일 전 (주니어 개발자의 Kotlin 도입 이야기)", "body":"body 테스트"}}';
  const { data } = JSON.parse(response);

  return {
    title: data.title,
    description: data.body,
  };
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

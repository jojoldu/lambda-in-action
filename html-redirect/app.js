const fs = require('fs');

const html = fs.readFileSync('index.html', { encoding: 'utf-8' });

exports.handler = async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);

  const userName = event.queryStringParameters?.name;
  const body = html.replace('{userName}', userName || '');

  return {
    statusCode: 200,
    headers: {
      'Context-Type': 'text/html',
    },
    body: body,
  };
};

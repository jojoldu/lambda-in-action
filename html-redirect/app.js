import fs from 'fs';

const html = fs.readFileSync('index.html', { encoding: 'utf8' });

export const handler = async (event, context) => {
  console.log(`event: ${JSON.stringify(event)}`);

  const id = event.queryStringParameters?.id;
  const userName = event.queryStringParameters?.name;
  const body = html
    .replace(/{userName}/g, userName || '')
    .replace(/{id}/g, id || '');

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body,
  };

  return response;
};

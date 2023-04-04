import { awslogs, data, event_error } from './data';
import {
  handler,
  Message,
  send,
  sendMessages,
  slackMessage,
  WEB_HOOKS,
} from '../app-one';

describe('rds logs slack e2e', () => {
  it('slack 발송', async () => {
    await send(slackMessage(new Message(event_error, '')), WEB_HOOKS.DDL);
  });

  it('sendMessages flow', async () => {
    await sendMessages(data.logEvents, data.logStream);
  });

  it('전체 flow', async () => {
    await handler(JSON.parse(awslogs), {});
  });
});

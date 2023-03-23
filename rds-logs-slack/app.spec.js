import { Message } from './app';
import {
  data,
  event_ddl,
  event_error,
  event_explain,
  event_slow,
} from './data';

describe('rds-logs-slack', () => {
  it('decode', () => {
    const { logStream } = data;

    expect(logStream).toBe('ant-man-rds-dev-2.0');
  });

  it('duration이 초로 변환된다', () => {
    const result = new Message(event_slow, '').queryTime;

    expect(result).toBe('3.003');
  });

  it('IP가 추출된다', () => {
    const result = new Message(event_slow, '').userIp;

    expect(result).toBe('222.99.194.226');
  });

  it('PID가 추출된다', () => {
    const result = new Message(event_slow, '').pid;

    expect(result).toBe('7699');
  });

  it('user가 추출된다', () => {
    const result = new Message(event_slow, '').user;

    expect(result).toBe('inflab@ant1');
  });

  it('slow Query가 추출된다', () => {
    const result = new Message(event_slow, '').query;

    expect(result).toBe('select pg_sleep(1)');
  });

  it('error Query가 추출된다', () => {
    const result = new Message(event_error, '').query;

    expect(result).toBe(
      'update or delete on table "users" violates foreign key constraint "carts_user_id_foreign" on table "carts"',
    );
  });

  it('error type이 추출된다', () => {
    const result = new Message(event_error, '').type;

    expect(result).toBe('ERROR');
  });

  it('slow type이 추출된다', () => {
    const result = new Message(event_slow, '').type;

    expect(result).toBe('SLOW');
  });

  it('ddl type이 추출된다', () => {
    const result = new Message(event_ddl, '').type;

    expect(result).toBe('DDL');
  });

  it('3초이상이면 전송 가능하다', () => {
    const result = new Message(event_slow, '').isSendable;

    expect(result).toBe(true);
  });

  it('ERROR이면 전송 가능하다', () => {
    const result = new Message(event_error, '').isSendable;

    expect(result).toBe(true);
  });

  it('DDL이면 전송 가능하다', () => {
    const result = new Message(event_ddl, '').isSendable;

    expect(result).toBe(true);
  });

  it('explain이면 전송하지 않는다', () => {
    const result = new Message(event_explain, '').isSendable;

    expect(result).toBe(false);
  });
});

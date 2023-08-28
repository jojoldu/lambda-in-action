import {
  data,
  event_ddl,
  event_error,
  event_explain,
  event_slow,
} from './data';
import { Message } from '../app';

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

  describe('DDL', () => {
    it('alter table', () => {
      const message =
        '2023-04-25 05:58:55 UTC:222.99.194.226(51891):inflab@antman:[7061]:LOG:  00000: execute <unnamed>: alter table "offline_course"    add column "inquiry_email" varchar(1000) null,    add column "inquiry_link" varchar(1000) null';

      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        'alter table "offline_course"    add column "inquiry_email" varchar(1000) null,    add column "inquiry_link" varchar(1000) null',
      );
    });
  });

  describe('Slow Query', () => {
    it('SELECT 수동 쿼리', () => {
      const message =
        '2023-08-28 09:48:02 UTC:10.1.58.215(57246):inflab@rallit:[29594]:LOG:  00000: duration: 1140.633 ms  execute <unnamed>: SELECT t.*\n' +
        '\tFROM public.job_seeker t\n' +
        '\tORDER BY profile_image\n' +
        '\tLIMIT 501';

      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        'SELECT t.*\n' +
          '\tFROM public.job_seeker t\n' +
          '\tORDER BY profile_image\n' +
          '\tLIMIT 501',
      );
    });

    it('update 쿼리', () => {
      const message =
        '2023-03-25 12:23:09 UTC:10.2.6.234(49086):inflearn_monolith_rw@antman:[19827]:LOG:  duration: 3906.264 ms  statement: update "posts" set "body" = \'<h3>모집 개요</h3><p>일/화/목 저녁 (8시~10시) 에 온라인으로 만나 한 문제씩 풉니다!</p><ul><li><p>노션 :<a target="_blank" rel="noopener noreferrer nofollow" href="https://www.notion.so/4-1d8fe1b49ddc4c5f9886ea8793962358?pvs=4">https://www.notion.so/4-1d8fe1b49ddc4c5f9886ea8793962358?pvs=4</a></p></li></ul><ul><li><p>대상 :</p><ul><li><p><strong>취업준비용 코테 준비하시는 분</strong></p></li><li><p>일/화/목 평일 저녁 8-10시 온라인 일정 참여 가능하신 분</p></li><li><p>벌금 및 보증금 제도에 동의하시는 분들 ( 노션 필독 바람 )</p><p>&nbsp;</p></li></ul></li><li><p>예상 모집인원 : 최대 6명 / 추가 3명 모집</p></li><li><p>구글 폼 : <a target="_blank" rel="noopener noreferrer nofollow" href="https://forms.gle/fRMJpFNCiGk4xPYh6">https://forms.gle/fRMJpFNCiGk4xPYh6</a></p><ul><li><p>늦어도 3/31 금요일 자정 전까지는 연락 드립니다.</p></li></ul><p>&nbsp;</p></li></ul><ul><li><p>스터디 일정 : 4/2-4/29 (4주간 진행)</p><ul><li><p>일, 화, 목 (8pm-10pm) - 온라인</p></li><li><p>(선택) 토 모각코 (12:00~18:00 ) - 오프라인/ 지역 서울</p><ul><li><p>온라인 참여도 가능합니다~</p></li></ul><p>&nbsp;</p></li></ul></li><li><p>풀게되는 문제 :</p><ul><li><p>평일 : 프로그래머스 LV 2~3 / 백준 gold 수준의 문제 중 1문제</p></li><li><p>주말 : 카카오 기출</p><p>&nbsp;</p></li></ul></li><li><p>스터디 방식</p><ul><li><p>다같이 화면 공유 가능한 플랫폼 이용해서 진행</p><p>EX) 디스코드 /줌 /그루미 (아직 미정입니다! 추천해주셔도 좋아요)</p></li><li><p>기본적으로 같은 문제를 정해서 풉니다.</p></li><li><p>먼저 끝나시면 남은 시간엔 다른거 푸셔도 무방합니다~</p></li></ul><p>&nbsp;</p></li></ul>\', "edited_at" = \'2023-03-25T12:23:05.818Z\', "updated_at" = \'2023-03-25T12:23:05.821Z\' where "id" = 825623';
      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        'update "posts" set "body" = \'<h3>모집 개요</h3><p>일/화/목 저녁 (8시~10시) 에 온라인으로 만나 한 문제씩 풉니다!</p><ul><li><p>노션 :<a target="_blank" rel="noopener noreferrer nofollow" href="https://www.notion.so/4-1d8fe1b49ddc4c5f9886ea8793962358?pvs=4">https://www.notion.so/4-1d8fe1b49ddc4c5f9886ea8793962358?pvs=4</a></p></li></ul><ul><li><p>대상 :</p><ul><li><p><strong>취업준비용 코테 준비하시는 분</strong></p></li><li><p>일/화/목 평일 저녁 8-10시 온라인 일정 참여 가능하신 분</p></li><li><p>벌금 및 보증금 제도에 동의하시는 분들 ( 노션 필독 바람 )</p><p>&nbsp;</p></li></ul></li><li><p>예상 모집인원 : 최대 6명 / 추가 3명 모집</p></li><li><p>구글 폼 : <a target="_blank" rel="noopener noreferrer nofollow" href="https://forms.gle/fRMJpFNCiGk4xPYh6">https://forms.gle/fRMJpFNCiGk4xPYh6</a></p><ul><li><p>늦어도 3/31 금요일 자정 전까지는 연락 드립니다.</p></li></ul><p>&nbsp;</p></li></ul><ul><li><p>스터디 일정 : 4/2-4/29 (4주간 진행)</p><ul><li><p>일, 화, 목 (8pm-10pm) - 온라인</p></li><li><p>(선택) 토 모각코 (12:00~18:00 ) - 오프라인/ 지역 서울</p><ul><li><p>온라인 참여도 가능합니다~</p></li></ul><p>&nbsp;</p></li></ul></li><li><p>풀게되는 문제 :</p><ul><li><p>평일 : 프로그래머스 LV 2~3 / 백준 gold 수준의 문제 중 1문제</p></li><li><p>주말 : 카카오 기출</p><p>&nbsp;</p></li></ul></li><li><p>스터디 방식</p><ul><li><p>다같이 화면 공유 가능한 플랫폼 이용해서 진행</p><p>EX) 디스코드 /줌 /그루미 (아직 미정입니다! 추천해주셔도 좋아요)</p></li><li><p>기본적으로 같은 문제를 정해서 풉니다.</p></li><li><p>먼저 끝나시면 남은 시간엔 다른거 푸셔도 무방합니다~</p></li></ul><p>&nbsp;</p></li></ul>\', "edited_at" = \'2023-03-25T12:23:05.818Z\', "updated_at" = \'2023-03-25T12:23:05.821Z\' where "id" = 825623',
      );
    });

    it('불필요한 데이터 parse 쿼리', () => {
      const message =
        '2023-04-26 05:59:14 UTC:10.0.1.58(56344):inflearn_ro@antman:[4632]:LOG:  00000: duration: 9517.967 ms  parse <unnamed>: SELECT "terms".*, "terms"."course_id" FROM "_courses_terms" AS "terms" WHERE "course_id" IN ($1) order by "_seq", "seq", "id"';
      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        'SELECT "terms".*, "terms"."course_id" FROM "_courses_terms" AS "terms" WHERE "course_id" IN ($1) order by "_seq", "seq", "id"',
      );
    });

    it('누락된 쿼리', () => {
      const message =
        "2023-04-26 08:47:23 UTC:222.99.194.226(60759):dev_ro@antman:[6162]:LOG:  00000: duration: 11468.120 ms  execute <unnamed>: SELECT * from completes as com  inner join users as u on u.email = 'abhidhamma91@gmail.com'  inner join units as un on un.course_id IN (select vouchers.course_id                                             from vouchers                                             where user_id = u.id)  where completed_at > '2022-01-01'  order by completed_at";
      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        "SELECT * from completes as com  inner join users as u on u.email = 'abhidhamma91@gmail.com'  inner join units as un on un.course_id IN (select vouchers.course_id                                             from vouchers                                             where user_id = u.id)  where completed_at > '2022-01-01'  order by completed_at",
      );
    });
  });

  it('slow Query가 추출된다', () => {
    const result = new Message(event_slow, '').query;

    expect(result).toBe('select pg_sleep(1)');
  });

  describe('Error Query', () => {
    it('dot(.)이 있는 쿼리', () => {
      const message =
        '2023-03-25 13:58:16 UTC:10.0.0.43(59886):inflearn_ro@antman:[27123]:ERROR:  invalid input syntax for type integer: "3010.17"';

      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe('invalid input syntax for type integer: "3010.17"');
    });

    it('일반 쿼리', () => {
      const result = new Message(event_error, '').query;

      expect(result).toBe(
        'update or delete on table "users" violates foreign key constraint "carts_user_id_foreign" on table "carts"',
      );
    });
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

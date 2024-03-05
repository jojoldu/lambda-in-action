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

    it('데이터독 주석 메세지 제거', () => {
      const message =
        '2023-04-26 05:59:14 UTC:10.0.1.58(56344):inflearn_ro@antman:[4632]:LOG:  00000: duration: 9517.967 ms  /dddbs=\'rallit-admin-backend-postgres\',dde=\'prod\',ddps=\'rallit-admin-backend\',ddpv=\'undefined\',traceparent=\'00-65e675980000000013f83cd7d635ea6c-0af4b6ee4d1d53ad-00\'/ SELECT COUNT(1) AS "cnt" FROM "job_seeker" "jobSeeker" WHERE "jobSeeker"."resume_created_at" >= $1 and "jobSeeker"."resume_created_at" < $2';
      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      ).query;

      expect(result).toBe(
        'SELECT COUNT(1) AS "cnt" FROM "job_seeker" "jobSeeker" WHERE "jobSeeker"."resume_created_at" >= $1 and "jobSeeker"."resume_created_at" < $2',
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

    it('쿼리에 DDL이 있어도 무시된다', () => {
      const message =
        '2023-10-28 04:17:03 UTC:10.2.10.103(34782):inflearn_monolith_rw@antman:[20151]:LOG:  00000: duration: 185.511 ms  statement: insert into "posts" ("created_at", "updated_at", "type", "open_range", "body", "unit_current_time", "allowed_cmt_email", "editor_image_ids", "cmt_cnt", "recommended_cnt", "unrecommended_cnt", "is_spam", "bookmark_cnt", "edit_status", "edited_at", "user_id", "course_id", "unit_id") values (\'2023-10-28T04:17:03.207Z\', \'2023-10-28T04:17:03.207Z\', \'bookmark\', \'all\', \'<h3>예외와 트랜잭션 커밋, 롤백 - 활용</h3><p>스프링은 왜 체크 예외는 커밋하고, 언체크(런타임) 예외는 롤백할까?</p><p>스프링 기본적으로 체크 예외는 비즈니스 의미가 있을 때 사용하고, 런타임(언체크) 예외는 복구 불가능한 예외로 가정한다.</p><ul><li><p>체크 예외: 비즈니스 의미가 있을 때 사용</p></li><li><p>언체크 예외: 복구 불가능한 예외</p></li></ul><p>참고로 꼭 이런 정책을 따를 필요는 없다. 그때는 앞서 배운 <code>rollbackFor</code> 라는 옵션을 사용해서 체크 예외도 롤백하면 된다.</p><p>그런데 비즈니스 의미가 있는 <strong>비즈니스 예외</strong>라는 것이 무슨 뜻일까? 간단한 예제로 알아보자. (아래와 같은 비즈니스 요구사항이 있다고 가정해보자.)</p><p>&nbsp;</p><p><strong>비즈니스 요구사항</strong><br>주문을 하는데 상황에 따라 다음과 같이 조치한다.</p><ul><li><p><strong>1) 정상</strong>: 주문시 결제를 성공하면 주문 데이터를 저장하고 결제 상태를 완료로 처리한다.</p></li><li><p><strong>2) 시스템 예외</strong>: 주문시 내부에서 복구 불가능한 예외가 발생하면 전체 데이터를 롤백한다.</p></li><li><p><strong>3) 비즈니스 예외</strong>: 주문시 결제 잔고가 부족하면 주문 데이터를 저장하고, 결제 상태를 대기로 처리한다.</p><ul><li><p><strong>이 경우 고객에게 잔고 부족을 알리고 별도의 계좌로 입금하도록 안내한다.</strong></p></li></ul></li></ul><p>이때 결제 잔고가 부족하면 <code>NotEnoughMoneyException</code> 이라는 체크 예외가 발생한다고 가정하겠다. 이 예외는 시스템에 문제가 있어서 발생하는 시스템 예외가 아니다. 시스템은 정상 동작했지만, 비즈니스 상황에서 문제가 되기 때문에 발생한 예외이다. 더 자세히 설명하자면, 고객의 잔고가 부족한 것은 시스템에 문제가 있는 것이 아니다. 오히려 시스템은 문제 없이 동작한 것이고, 비즈니스 상황이 예외인 것이다. 이런 예외를 비즈니스 예외라 한다. 그리고 비즈니스 예외는 매우 중요하고, 반드시 처리해야 하는 경우가 많으므로 체크 예외를 고려할 수 있다.</p><p>👉 실제 코드로 알아보자.</p><ul><li><p><strong>NotEnoughMoneyException 생성</strong>: src &gt; main &gt; java &gt; hello &gt; springtx &gt; order 패키지를 생성하자. 그리고 그 내부에 NotEnoughMoneyException 클래스를 생성하자.<br><img src="https://cdn.inflearn.com/public/files/posts/87d74670-50ba-4fde-9876-8a65b8dd86e3/image.png">- 결제 잔고가 부족하면 발생하는 비즈니스 예외이다. <code>Exception</code> 을 상속 받아서 체크 예외가 된다.</p></li><li><p><strong>Order 생성</strong>: src &gt; main &gt; java &gt; hello &gt; springtx &gt; order 패키지 내부에 Order 클래스를 생성하자.<br><img src="https://cdn.inflearn.com/public/files/posts/2a3244f3-8535-40be-8114-960bc43d8ac6/image.png">- JPA를 사용하는 <code>Order</code> 엔티티이다.<br>- 예제를 단순하게 하기 위해 <code>@Getter</code> , <code>@Setter</code> 를 사용했다. ( 참고로 실무에서는 엔티티에 <code>@Setter</code> 를 남발해서 불필요한 변경 포인트를 노출하는 것은 좋지 않다. )<br>- (주의) <code>@Table(name = "orders")</code> 라고 했는데, 테이블 이름을 지정하지 않으면 테이블 이름이 클래스 이름인 <code>order</code> 가 된다. <code>order</code> 는 데이터베이스 예약어( <code>order by</code> )여서 사용할 수 없다. 그래서 <code>orders</code> 라는 테이블 이름을 따로 지정해주었다.</p></li><li><p><strong>OrderRepository 생성</strong>: src &gt; main &gt; java &gt; hello &gt; springtx &gt; order 패키지 내부에 OrderRepository 클래스를 생성하자.<br><img src="https://cdn.inflearn.com/public/files/posts/96a4f6ff-7b06-47b3-ad30-0fe05efe9a08/image.png">- 스프링 데이터 JPA를 사용한다.</p></li><li><p><strong>OrderService 생성</strong>: src &gt; main &gt; java &gt; hello &gt; springtx &gt; order 패키지 내부에 OrderService 클래스를 생성하자.<br><img src="https://cdn.inflearn.com/public/files/posts/3430e235-9452-4d6f-8e6e-7460bf8d2835/image.png">- 여러 상황을 만들기 위해서 사용자 이름( <code>username</code> )에 따라서 처리 프로세스를 다르게 했다.<br>- <code>기본</code> : <code>payStatus</code> 를 <code>완료</code> 상태로 처리하고 정상 처리된다.<br>- <code>예외</code> : <code>RuntimeException("시스템 예외")</code> 런타임 예외가 발생한다.<br>- <code>잔고부족</code> : 1) <code>payStatus</code> 를 <code>대기</code> 상태로 처리한다. 2) <code>NotEnoughMoneyException("잔고가 부족합니다")</code> 체크 예외가 발생한다. 3) 잔고 부족은 <code>payStatus</code> 를 <code>대기</code> 상태로 두고, 체크 예외가 발생하지만, <code>order</code> 데이터는 커밋되기를 기대한다.</p></li><li><p><strong>OrderServiceTest 생성</strong>: test &gt; java &gt; hello &gt; springtx &gt; order 패키지를 생성하고 그 내부에 OrderServiceTest 클래스를 생성하자.</p></li><li><p><strong>정상 테스트</strong><br><img src="https://cdn.inflearn.com/public/files/posts/b804d977-9842-4073-9f93-fba09c4850e4/image.png"></p></li><li><p>실행하기 전에 다음을 추가하자. 이렇게 하면 JPA(하이버네이트)가 실행하는 SQL을 로그로 확인할 수 있다.</p><p><br><img src="https://cdn.inflearn.com/public/files/posts/938adfb7-3d80-4148-aa73-7b8d9102668f/image.png">- <code>logging.level.org.hibernate.SQL=DEBUG</code></p></li><li><p><strong>실행해보자.</strong><br><img src="https://cdn.inflearn.com/public/files/posts/de15efd6-00b7-453a-b6fd-a522f8ee4eaa/image.png">- 정상적으로 실행되는 것을 확인할 수 있다.</p></li><li><p>그런데 직접 테이블을 생성한 적은 없는데 어떻게 된걸까? 지금처럼 메모리 DB를 통해 테스트를 수행하면 테이블 자동 생성 옵션이 활성화 된다. JPA는 엔티티 정보를 참고해서 테이블을 자동으로 생성해준다.</p><ul><li><p>참고로 테이블 자동 생성은 <code>application.properties</code> 에 <code>spring.jpa.hibernate.ddl-auto</code> 옵션을 조정할 수 있다. ( <code>none</code> : 테이블을 생성하지 않는다. <code>create</code> : 애플리케이션 시작 시점에 테이블을 생성한다. )</p></li><li><p>실행 SQL 참고)<br><img src="https://cdn.inflearn.com/public/files/posts/6f7c44a0-40ea-406c-8d3f-2cbaca1e2e67/image.png">- <code>create table orders...</code></p><p>&nbsp;</p><p>&nbsp;</p></li></ul></li></ul>\', 1163, false, \'[]\', 0, 0, 0, false, 0, \'CREATED\', \'2023-10-28T04:17:03.207Z\', 1233111, 328990, 114687) returning "id"';

      const result = new Message(
        {
          message,
          timestamp: 1679485640000,
        },
        '',
      );

      expect(result.type).toBe('SLOW');
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

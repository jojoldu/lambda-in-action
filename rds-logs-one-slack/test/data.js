/* eslint-disable */
export const awslogs =
  '{ "awslogs": { "data": "H4sIAAAAAAAAAM1V3W7TMBh9FStXndSk/o3jiCIq2vVm08RarrZqShNTIuUP21k2VX0TbngKeCZ4Cb4OVQjUCWg1jZso3/Hn43O+4yhrr9TWJis9v2+0F3vj0Xx0cz6ZzUbTidf36q7SBmAVkRBzwSPMGMBFvZqaum1gZZB0dmAyO0iL1jptBknl/DKpfMD8TN/6O7yprVsZbT8UPwhmzuikBIbfN9AAQ4dtlzY1eePyujrNC2CwXnzlXY5naDw+66Px+Rn69unj189fvMUD3+RWV27bs/byDGiZ5EIwSqWkmCmlIoZZqJjgSqiQhkQyGcE7UxxqHhHOueSEUDjb5TAUl5Tgj4RSCcFlSDDG/d2wgJ5iynzMfMoQDmOhYkrQ2/nrmFIaKBUQxQNKw57AIuQncV69K5LlK7BK4ivFmVzEZxfTGKGsNcnWYozgABHgUKLSIqTvdNo6jV60VZWUOnsZI6sLnTrUrG5soXXTIyegVN85k6ROZ6e5LjJwv/Y68os6aOooIDuR25pB/c9atxs5bDxK8WbTPy4e9rzxCPFgtimSKr6urt2bVpt7NIcY9tnddlxq2xYOoV4K93+IA4yDAJ4EmbqzQ4K6PHPvh/w/CfMJ/e2JHvRwLDkTGMRzIimELhWshoRSEsmIEiI4oTxSmBD+SPT0j9HTQ6Lfc6EzUzfIJctCIwcyDomMHh3ZX+g6etTi2Uedws8BkJ+menmG8sod9J08ydAfV7jZLDbfAS5PnopYBwAA" } } ';
export const event_slow = {
  "timestamp": 1679485640000,
  "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:  duration: 3003.040 ms  execute <unnamed>: select pg_sleep(1)",
};
export const event_ddl = {
  "timestamp": 1679485640000,
  "message": "2023-03-23 06:08:23 UTC:222.99.194.226(50564):test@inflab:[9437]:LOG:  execute <unnamed>: create table test(id int)",
};

export const event_explain = {
  "timestamp": 1679485640000,
  "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:  duration: 3003.029 ms  plan:\n\tQuery Text: select pg_sleep(1)\n\tResult  (cost=0.00..0.01 rows=1 width=4)",
};
export const event_error = {
  "timestamp": 1679485640000,
  "message": '2023-03-22 08:46:36 UTC:222.99.194.226(60346):test@antman:[30301]:ERROR:  update or delete on table "users" violates foreign key constraint "carts_user_id_foreign" on table "carts"',
};

export const data = {
  "logStream": "test-2.0",
  "logEvents": [
    {
      "id": "37453781322231130668491299941284769867471356897593655300",
      "timestamp": 1679485640000,
      "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:  duration: 3003.040 ms  execute <unnamed>: select pg_sleep(1)",
      "extractedFields": {
        "w1": "2023-03-22",
        "w2": "11:47:20",
        "w3": "UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:",
        "w4": "duration: 3003.029 ms  plan:\n\tQuery Text: select pg_sleep(1)\n\tResult  (cost=0.00..0.01 rows=1 width=4)"
      }
    },
    {
      "id": "37453781344531875867021923082820488140119718403574071302",
      "timestamp": 1679485641000,
      "message": "2023-03-22 11:47:21 UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:  execute <unnamed>: create table test(id int)",
      "extractedFields": {
        "w1": "2023-03-22",
        "w2": "11:47:21",
        "w3": "UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:",
        "w4": "execute <unnamed>: create table test(id int)"
      }
    },
    {
      "id": "37453781344531875867021923082820488140119718403574071302",
      "timestamp": 1679485641000,
      "message": "2023-03-22 11:47:21 UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:  execute <unnamed>: drop table",
      "extractedFields": {
        "w1": "2023-03-22",
        "w2": "11:47:21",
        "w3": "UTC:222.99.194.226(49157):test@inflab:[7699]:LOG:",
        "w4": "execute <unnamed>: drop table"
      }
    }
  ]
}

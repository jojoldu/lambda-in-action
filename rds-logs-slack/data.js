/* eslint-disable */
export const awslogs =
  '{ "awslogs": { "data": "H4sIAAAAAAAAAM1Ty27bMBD8FUInB7BkPiRKIuqiRu344iBo7J4SI2CkrStAr5JUlMDQLb/Q/+iP5R+6SuFDi16KoGgvBHY4OzvDBY9eBdbqA+weW/CUt1zsFrcXq+12sV55U6/pazAIpwmTNIzChAqBcNkc1qbpWryZ6d7OTG5nWdlZB2ama+dXuvYR83O4909421h3MGC/lD8Ets6ArlDh1wYeUGTY7s5mpmhd0dTnRYkK1lPX3tVyS5bLzZQsLzbk+evT89M3b/+it7qH2o2co1fkKCviMBI8YjFliRAho7EMY855wpM0TSMZC4GpGFYyiiWNqeBSJnyc7Qp8FKcrzMdknIaSJSmjlE5Pj4XynHLhU+FzTmikGFOCkY+79wonBGkasDQMOJeTSMpUnqmi/lTqu3cYlalrLtDEXm0u14qQvDN6zKgIp5QHcUpJZQmBB8g6B+RNV9e6gvytIhZKyBxpD7e2BGgn/AytwoMzOnOQnxdQ5hj/6PXsJ3tI6jkiJ5djLbD+c7NjZ4idr7I8DNPXLYj94wXFyUvattS1uqlv3IcOzCPZ4SJ+l3dkXIHtSkfIJMMvMKcBpUGAJyOm6e2ckb7I3ed5+L+s8y8GHIb98B0x/beFcgQAAA==" } } ';
export const event_slow = {
  "timestamp": 1679485640000,
  "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:  duration: 3003.040 ms  execute <unnamed>: select pg_sleep(1)",
};
export const event_ddl = {
  "timestamp": 1679485640000,
  "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:  execute <unnamed>: drop table test",
};

export const event_explain = {
  "timestamp": 1679485640000,
  "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:  duration: 3003.029 ms  plan:\n\tQuery Text: select pg_sleep(1)\n\tResult  (cost=0.00..0.01 rows=1 width=4)",
};
export const event_error = {
  "timestamp": 1679485640000,
  "message": '2023-03-22 08:46:36 UTC:222.99.194.226(60346):inflearn_rw@antman:[30301]:ERROR:  update or delete on table "users" violates foreign key constraint "carts_user_id_foreign" on table "carts"',
};

export const data = {
  "logStream": "ant-man-rds-dev-2.0",
  "logEvents": [
    {
      "id": "37453781322231130668491299941284769867471356897593655300",
      "timestamp": 1679485640000,
      "message": "2023-03-22 11:47:20 UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:  duration: 3003.029 ms  plan:\n\tQuery Text: select pg_sleep(1)\n\tResult  (cost=0.00..0.01 rows=1 width=4)",
      "extractedFields": {
        "w1": "2023-03-22",
        "w2": "11:47:20",
        "w3": "UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:",
        "w4": "duration: 3003.029 ms  plan:\n\tQuery Text: select pg_sleep(1)\n\tResult  (cost=0.00..0.01 rows=1 width=4)"
      }
    },
    {
      "id": "37453781344531875867021923082820488140119718403574071302",
      "timestamp": 1679485641000,
      "message": "2023-03-22 11:47:21 UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:  execute <unnamed>: create table test(id int)",
      "extractedFields": {
        "w1": "2023-03-22",
        "w2": "11:47:21",
        "w3": "UTC:222.99.194.226(49157):inflab@ant1:[7699]:LOG:",
        "w4": "execute <unnamed>: create table test(id int)"
      }
    }
  ]
}

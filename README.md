# Jeko
작명에 큰 의미는 없고 아래의 3개 프로젝트의 백엔드 서버에 쓸 **공용 모듈** 모음집을 의미한다.

## Related Projects
1. pman(https://github.com/codingjoa/pman)
2. Boongoose-BE(https://github.com/codingjoa/Bongoose-BE)
3. 찬없찬 팀 백엔드(준비중)

## examples
- jeko/app
```javascript
const app = require('jeko').app;
const api = app('/api/v1');

const foo = api('/foo', {
/*
   = Allow Methods =
   GET /api/v1/foo
   POST /api/v1/foo
*/
  Read(req, res, next) {
    res.json({
      foo: 'bar'
    });
  },
  Create
})('/bar', {
/*
   = Allow Methods =
   GET /api/v1/foo/bar
*/
  Read(req, res, next) {
    throw new Error();
  }
});

const hello = api('/hello', {
/*
  = Allow Methods =
  GET /api/v1/hello
*/
  Read(req, res, next) {
    res.send('hello, world!');
  }
});

/*
   3000번 포트로 express 서버 개방
*/
app.listen(3000);
```

- jeko/maria (mariadb)
```javascript
const app = require('jeko').app;
const maria = require('jeko').maria;
const api = app('/api/v1');
const user = api('/user/:userId', {
/*
  = Allow Methods =
  GET /api/v1/user/:userId
*/
  Read(req, res, next) {
    const userId = req.params?.userId;
    if(userId === undefined) {
      // 동기 오류는 throw로 넘길 수 있다.
      throw new Error('Invalid Parameter'); // next(new Error('Invalid Parameter'));
    }
    const query = maria('query');
    query('select * from user where user.id=?', [
      userId
    ])(result => {
/*
  result.rows: Array
  result.affectedRows: Number (affectedRows)
  result.lastID: Number (LAST_INSERT_ID)
*/
      if(!result.rows.length) {
        // 내부 try-catch에 의해 아래의 query().catch(err => next(err)) 가 받게 된다.
        throw new Error('Not Found Error');
      }
      res.json({
        user: result.rows[0]
      });
    })

    // 비동기 오류는 next callback으로만 넘길 수 있다.
    query().catch(err => next(err));
  }
});

```

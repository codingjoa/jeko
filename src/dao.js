const mariadb = require('mariadb');
module.exports = config => {
  const pool = mariadb.createPool(config);
  class DAO {
    constructor() {
      this.enabled = false;
      this.isEnabled = function() {
        if(!this.enabled) {
          throw new Error();
        }
      };
      // serialize 함수에서 this를 바인딩 할 때 클래스에서 정의한 메소드는
      // 읽을 수 없고 this에 직접 넣은 필드, 메소드만 접근할 수 있기 때문에
      // 이렇게 생성자에서 넣어주었다.
      this.commit = async function () {
        this.isEnabled();
        await this.connection.commit();
        await this.connection.release();
        this.enabled = false;
        delete this.connection;
      };
      this.rollback = async function () {
        this.isEnabled();
        await this.connection.rollback();
        await this.connection.release();
        this.enabled = false;
        delete this.connection;
      };
    }

    async getConnection() {
      return pool.getConnection();
    }

    async begin() {
      this.enabled = true;
      this.connection = await this.getConnection();
      await this.connection.beginTransaction();
    }

    async serialize(callback) {
      try {
        await this.begin();
        const result = await callback({
          get: this.get.bind(this),
          run: this.run.bind(this)
        });
        await this.commit();
        return result;
      } catch(err) {
        // get이나 run에서 온 오류는 이미 rollback이후이기 때문에
        // 그 외에서 온 경우에만 롤백 실행
        this.enabled && await this.rollback();
        throw err;
      }
    }

    async get(query, param) {
      try {
        // console.log(this);
        const rows = await this.connection.query(query, param);
        return Array.from(rows);
      } catch(err) {
        console.error(err);
        await this.rollback();
        throw err;
        //throw new Error();
      }
    }

    async run(query, param) {
      try {
        const {
          affectedRows, insertId: lastID
        } = await this.connection.query(query, param);
        return {
          affectedRows,
          lastID
        };
      } catch(err) {
        await this.rollback();
        throw err;
        //throw new Error();
      }
    }
  }
  return DAO;
};

const config = {
  host: process.env.MARIADB_HOST ?? 'localhost',
  port: process.env.MARIADB_PORT ?? 3306,
  user: 'ky',
  database: process.env.MARIADB_NAME ?? 'react',
  password: '1234',
  connectionLimit: 5,
};

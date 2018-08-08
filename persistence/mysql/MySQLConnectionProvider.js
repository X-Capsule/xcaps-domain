const mysql2 = require('mysql2');
const Promise = require('bluebird');

const singletonSymble = Symbol.for('mysql2.singleton.symbol');

/**
 * 对第三方库mysql2的封装，在基于connection pool单例的基础上对外提供Connection实例对象
 * @class
 */
class MySQLConnectionProvider {
  /**
   * MySQLConnectionProvider构造函数
   * @method constructor
   * @param {Object} options - 创建mysql connection pool所需参数
   * @param {string} options.host - 主机名
   * @param {string} options.user - 用户名
   * @param {string} options.password - 登录密码
   * @param {number} options.connectionLimit - 数据库最大连接数
   * @param {boolean} options.supportBigNumbers - 如果启用，则big numbers将转换为string类型
   * @param {boolean} options.bigNumberStrings - 如果启用则bigint和decimal将作为string类型操作
   */
  constructor(options = {}) {
    const {
      host,
      port,
      user,
      password,
      connectionLimit = 10,
      supportBigNumbers = true,
      bigNumberStrings = true,
    } = options;
    if (!Object.prototype.hasOwnProperty.call(global, singletonSymble)) {
      this.pool = mysql2.createPool({
        host,
        port,
        user,
        password,
        connectionLimit,
        supportBigNumbers,
        bigNumberStrings,
      });
      global[singletonSymble] = this.pool;
    } else {
      this.pool = global[singletonSymble];
    }
  }

  /**
   * 从connection pool里获取一个Connection实例对象
   * @method mysqlConnection
   * @returns {Promise.<Connection>}
   */
  mysqlConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        return resolve(connection);
      });
    });
  }
}

module.exports = MySQLConnectionProvider;

const { SequelizeSession, SequelizeSessionProvider } = require('./sequelize');

/**
 * 提供给持久层仓库各种ORM Session的管理工厂
 * @class
 */
class PersistenceManagerProvider {
  /**
   * 获取SequelizeSession实例对象
   * @param {Object} connection - 建立数据库连接所需参数
   * @param {string} connection.database - 数据库名
   * @param {string} connection.username - 用户名
   * @param {string} connection.password - 登录密码
   * @param {string} connection.host - 主机名
   * @param {string} connection.port - 端口号
   * @param {string} modelPath - sequelize数据库表定义的相关目录
   * @param {Object} options - 可选参数
   * @returns {Promise.<SequelizeSession>}
   */
  static sequelizeSession(connection, modelPath, options) {
    const sequelizeSessionProvider = new SequelizeSessionProvider(connection, modelPath, options);
    return new SequelizeSession({
      session: null,
      sessionProvider: sequelizeSessionProvider,
    });
  }
}

module.exports = PersistenceManagerProvider;

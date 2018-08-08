const PersistenceSession = require('../PersistenceSession');

/**
 * PersistenceSession子类，提供基于sequelize实例的方法
 * @class
 */
class SequelizeSession extends PersistenceSession {
  /**
   * SequelizeSession构造函数
   * @constructor
   * @param {Sequelize} session - Sequelize实例对象
   * @param {SequelizeSessionProvider} sessionProvider - SequelizeSessionProvider实例对象
   */
  constructor({ session, sessionProvider }) {
    super({ session, sessionProvider });
  }

  /**
   * 获取Sequelize实例对象
   * @method session
   * @returns {Sequelize}
   */
  get session() {
    if (!this._session) {
      if (!this._sessionProvider) {
        throw new Error('Require either a session or sequelizeSessionProvider');
      }
      return this._sessionProvider.session();
    }
    return this._session;
  }

  /**
   * 设置Sequelize实例对象
   * @method session
   * @param session {Sequelize}
   */
  set session(session) {
    this._session = session;
  }
}

module.exports = SequelizeSession;

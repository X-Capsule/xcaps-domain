/* eslint-disable no-underscore-dangle */
const Repository = require('../domain/Repository');
const PersistenceManagerProvider = require('./PersistenceManagerProvider');

/**
 * 持久层SequelizeRepository接口，为所有继承此类的repository提供默认的构造函数
 * @interface
 */
class SequelizeRepository extends Repository {
  /**
   * @description SequelizeRepository构造函数
   * @constructor
   * @param {Object} settings          - 建立数据库连接所需参数
   * @param {string} settings.database - 数据库名
   * @param {string} settings.username - 用户名
   * @param {string} settings.password - 登录密码
   * @param {Object} settings.options  - 可选参数
   */
  constructor(settings) {
    super();
    this._settings = settings;
    const sequelizeSession = PersistenceManagerProvider.sequelizeSession(this.settings);
    this._session = sequelizeSession.session;
  }

  /**
   * 获取Sequelize实例对象
   * @method session
   * @returns {Sequelize}
   */
  get session() {
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

  get settings() {
    return this._settings;
  }

  set settings(settings) {
    this._settings = settings;
  }
}

module.exports = SequelizeRepository;

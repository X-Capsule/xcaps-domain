/**
 * 持久层Session抽象类接口
 * @interface
 */
class PersistenceSession {
  /**
   * PersistenceSession构造函数
   * @param {Object} session - 各种ORM工具的接口实例对象
   * @param sessionProvider - SessionProvider实例对象
   */
  constructor({ session, sessionProvider }) {
    this._session = session;
    this._sessionProvider = sessionProvider;
  }
  get session() {
    return this._session;
  }
  set session(session) {
    this._session = session;
  }
}

module.exports = PersistenceSession;

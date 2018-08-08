const AssertionConcern = require('../AssertionConcern');
const { SessionContextProvider } = require('rms-appengine');
const _ = require('lodash');

class SessionContext extends AssertionConcern {
  /**
   * @description 获取实例化对象绑定的 SessionContext 实例化对象.
   * @return {SessionContext|*}
   */
  getSessionContext() {
    return SessionContextProvider.getClassSessionContext(this);
  }
  /**
   * @description 该方法提供了创建实例对象的能力. 并且如果提供了"上下文"选项, 可以将其"上下文"
   * 绑定到该对象上.
   * @param {Object} [options]
   * @param {Array<*>|*} [options.args]  - 提供实例化对象的实参(实参可以是实参数组或者是单个实参值)
   * @param {Object} [options.context] - 提供绑定到实例化对象上的"上下文"对象
   * @return
   */
  static createInstance(options = {}) {
    let ClassObject = this;
    const { args, context } = options;
    let newArgs = [];
    // 如果提供了 context 值, 则需要将 context 绑定到需要实例化的类上
    if (!_.isEmpty(context)) {
      ClassObject = SessionContextProvider.bindClassSessionContext(this, context);
    }
    if (!_.isEmpty(args) && !_.isArray(args)) {
      // 如果是非数组类型, 则 args 作为默认第一个实参被传入对象中.
      newArgs = _.concat([], args);
    }
    return new ClassObject(...newArgs);
  }
}

module.exports = SessionContext;

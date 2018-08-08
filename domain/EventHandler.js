const _ = require('lodash');
const Event = require('./Event');

/**
 * @description 事件处理器基类
 * @class
 */
class EventHandler {
  /**
   * @description 初始化事件名
   * @param {string} eventName - 事件名
   */
  constructor(eventName) {
    this.eventName = eventName;
  }
  /**
   * @description eventName getter方法
   * @returns {string} 事件名
   */
  get eventName() {
    return this.eventNameValue;
  }
  /**
   * @description eventName setter方法
   * @param {string} value - 事件名
   */
  set eventName(value) {
    this._assertEventName(value);
    this.eventNameValue = value;
  }
  /**
   * @description 事件处理方法
   * @param {Error} err - 错误异常
   * @param {Event} event - 事件名
   * @param {function} handleResult - 回调接受处理结果
   */
  handleEvent(err, event, handleResult) {
    this._assertValidDomainEvent(Event);
  }
  /**
   * @description 断言是否为有效的领域事件
   * @param {Event} event - 事件处理器
   * @private
   */
  _assertValidDomainEvent(event) {
    if (!(event instanceof Event)) {
      throw new Error(`Not a valid event definition: ${event}`);
    }
  }
  /**
   * @description 断言是否为有效的领域事件
   * @param {string} eventName - 事件名
   * @private
   */
  _assertEventName(eventName) {
    if (_.isEmpty(eventName)) {
      throw new Error('eventName must be provided');
    }
  }
  /**
   * @description 获取subscribe操作相关配置
   * @returns {{priority: number}} 相关配置信息
   */
  getSubConfig() {
    return {
      priority: 0,
    };
  }
  /**
   * @description 获取Event自定义相关内容
   * @abstract
   * @returns {Object} 自定义相关内容
   */
  props() {}
}

module.exports = EventHandler;

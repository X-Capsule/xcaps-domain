const uuid = require('uuid/v4');
const moment = require('moment-timezone');
const _ = require('lodash');

/**
 * @description 事件基类
 * @class
 */
class Event {
  /**
   * @description 初始化领域事件基础属性及相关配置
   * @options {Object} options - 可选参数
   * @options {Class<T>} [options.source] - 事件来源
   * @options {string} options.eventName - 事件名
   */
  constructor(options = {}) {
    const {
      id, source, eventName, date, eventData,
    } = options;
    this.id = id || uuid();
    this.eventName = eventName;
    this.date = date || moment().format('YYYY-MM-DD HH:mm:ss');
    this.source = source;
    this.eventData = eventData || {};
  }
  /**
   * @description id getter方法
   * @returns {string} 事件id
   */
  get id() {
    return this.idValue;
  }
  /**
   * @description id setter方法
   * @param {string} value - 事件id
   */
  set id(value) {
    this.idValue = value;
    if (this.idValue === undefined) {
      this.idValue = uuid();
    }
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
   * @description date getter方法
   * @returns {string} 事件创建日期
   */
  get date() {
    return this.dateValue;
  }
  /**
   * @description date setter方法
   * @param {string} value - 事件创建日期
   */
  set date(value) {
    this.dateValue = value;
    if (this.dateValue === undefined) {
      this.dateValue = moment().format('YYYY-MM-DD HH:mm:ss');
    }
  }
  /**
   * @description source getter方法
   * @returns {string} 事件来源
   */
  get source() {
    return this.sourceValue;
  }
  /**
   * @description source setter方法
   * @param {string} value - 事件来源
   */
  set source(value) {
    this.sourceValue = value;
  }

  get eventData() {
    return this.eventDataValue;
  }

  set eventData(val) {
    this.eventDataValue = val;
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
   * @description 获取publish操作相关配置
   * @returns {{expiration: number, priority: number, persistent: boolean}} 相关配置信息
   */
  getPubConfig() {
    return {
      expiration: 3 * 24 * 3600 * 1000,
      priority: 0,
      persistent: true,
    };
  }
  /**
   * @description 获取Event自定义相关内容
   * @abstract
   * @returns {Object} 自定义相关内容
   */
  props() {}
}

module.exports = Event;

/* eslint-disable no-unused-vars,class-methods-use-this */
/**
 * @description EventBus 类用于创建事件监听器,
 * @interface
 */
class EventBus {
  /**
   * @description 发布事件信息
   * @param options
   * @abstract
   */
  publish(options = {}) {}
  /**
   * @description 消费事件信息
   * @param options
   * @abstract
   */
  subscribe(options = {}) {}
}

module.exports = EventBus;

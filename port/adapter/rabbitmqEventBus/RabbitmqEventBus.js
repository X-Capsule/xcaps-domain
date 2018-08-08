/* eslint-disable no-shadow */
const _ = require('lodash');
const Promise = require('bluebird');
const EventBus = require('../../../domain/EventBus');
const ChannelService = require('./ChannelService');
const ConnectionService = require('./ConnectionService');
const Event = require('../../../domain/Event');

/**
 * @description RabbitMQ-based Event Bus implementation
 * @class
 */
class RabbitmqEventBus extends EventBus {
  /**
   * @description 创建 amqp connection client
   * @param {Object} options
   */
  static listen(options = {}) {
    const connection = ConnectionService.createConnection(options);
    /**
     * 初始化默认的两个 channels, 一个是 defaultChannel, 一个是 defaultPromiseChannel.
     * 分别是用于建立异步和同步确认两种机制的 channel.
     */
    ChannelService.initialize({ connection });
    this.connection = connection;
  }

  /**
   * @description 通过 event bus 向 MQ 服务发送 event.
   * @param {Event} event
   * @param {Object} options
   */
  static publish(event, options = {}) {
    const { handleConfirmEvent } = options;
    /**
     * 通过自定义 Event 协议结构, 需要解析 Event 的 headers 协议头部信息, 获取在 publish
     * 内容之前, 通过其相关 Event 提供协议内容来配置发布者.
     * 目前, 发布者配置提供一下选项. 根据需求实现该选项配置的周期性迭代.
     */
    const publisherConfig = event.getPubConfig();
    const channelPromise = ChannelService.getChannel();
    const headersOptions = {
      id: event.id,
      eventName: event.eventName,
      date: event.date,
      source: event.source,
      confirmMode: false,
      exchangeName: null,
    };
    return channelPromise.then((channel) => {
      channel
        .assertQueue(event.eventName)
        .then((ok) => {
          if (_.isFunction(handleConfirmEvent)) {
            headersOptions.confirmMode = true;
            headersOptions.confirmEventName = `${event.eventName}.confirmMode`;
            return channel.assertQueue(headersOptions.confirmEventName)
              .then(ok => channel.consume(headersOptions.confirmEventName, (message) => {
                const { headers, body } = JSON.parse(message.content.toString());
                const confirmEvent = new Event(_.assign({}, { eventData: body }, headers));
                return new Promise((resolve, reject) => {
                  try {
                    resolve(handleConfirmEvent(confirmEvent));
                  } catch (err) {
                    reject(err);
                  }
                }).then(() => {
                  channel.ack(message);
                  return ok;
                });
              }));
          }
          return ok;
        })
        .then((ok) => {
          const content = Buffer.from(JSON.stringify({
            headers: headersOptions,
            body: event.eventData,
          }));
          return channel.sendToQueue(event.eventName, content, publisherConfig);
        });
    });
  }
  /**
   * @description 注册事件处理器, 用来实现事件处理器的定义工作.
   * @param {EventHandler} eventHandler
   * @param {Object} options
   */
  static subscribe(eventHandler, options = {}) {
    if (_.isEmpty(eventHandler)) {
      throw new Error('Unknown eventHandler.');
    }
    const { priority } = eventHandler.getSubConfig();
    const consumeOption = {
      priority,
    };
    const channelPromise = ChannelService.getChannel();
    return channelPromise.then(channel => channel.assertQueue(eventHandler.eventName)
      .then(ok => channel.consume(eventHandler.eventName, (message) => {
        const { headers, body } = JSON.parse(message.content.toString());
        const event = new Event(_.assign({}, { eventData: body }, headers));
        const { confirmMode, confirmEventName } = headers;
        return new Promise((resolve, reject) => {
          try {
            eventHandler.handleEvent(null, event, (result) => {
              resolve(result);
            });
          } catch (err) {
            reject(err);
          }
        }).then((result) => {
          if (_.isEqual(confirmMode, true) && !_.isEmpty(confirmEventName)) {
            const confirmEvent = new Event(_.assign({}, { eventData: result }, {
              id: event.id,
              eventName: confirmEventName,
              date: event.date,
              source: event.source,
              confirmMode: false,
              exchangeName: null,
            }));

            const content = Buffer.from(JSON.stringify({
              headers: {
                id: event.id,
                eventName: confirmEventName,
                date: event.date,
                source: event.source,
                confirmMode: false,
                exchangeName: null,
              },
              body: confirmEvent.eventData,
            }));
            return channel.sendToQueue(confirmEvent.eventName, content);
          }
          return ok;
        }).then((ok) => {
          channel.ack(message);
          return ok;
        });
      }, consumeOption)));
  }
}

module.exports = RabbitmqEventBus;

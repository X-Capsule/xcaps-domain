const _ = require('lodash');

class ChannelService {
  static initialize(options = {}) {
    const { connection } = options;
    this.channels = {};
    this.addChannel('defaultChannel', connection);
    this.addConfirmChannel('defaultConfirmChannel', connection);
  }

  /**
   * @description 添加新的 channel
   * @param {string} channelName
   * @param {Connection} connection
   * @param {Object} options
   */
  static addChannel(channelName, connection, options = {}) {
    const { override = false } = options;
    if (_.has(this.channels, channelName) && !override) {
      return;
    }
    this.channels[channelName] = connection.then(conn => conn.createChannel());
  }

  /**
   * @description 添加新的 promise channel
   * @param {string} channelName
   * @param {Connection} connection
   * @param {Object} options
   */
  static addConfirmChannel(channelName, connection, options = {}) {
    const { override = false } = options;
    if (_.has(this.channels, channelName) && !override) {
      return;
    }
    this.channels[channelName] = connection.then(conn => conn.createConfirmChannel());
  }


  static getChannel(channelName) {
    const name = channelName || 'defaultChannel';
    return this.channels[name];
  }
}

module.exports = ChannelService;

/* eslint-disable class-methods-use-this */
const { connect } = require('amqplib');

class ConnectionService {
  /**
   * @description 创建 amqp 监听客户端
   * @param {Object} options
   * @param {string} options.protocol
   * @param {string} options.hostname
   * @param {string|number} [options.port]
   * @param {string} [options.username]
   * @param {string} [options.password]
   * @param {string} [options.locale]
   * @param {string} [options.frameMax]
   * @param {string} [options.heartbeat]
   * @param {string} [options.vhost]
   */
  static createConnection(options = {}) {
    const { protocol = 'amqp', hostname = 'localhost', port = '5672' } = options;
    if (!this.connection) {
      this.connection = connect({
        protocol,
        hostname,
        port,
      }).then(conn => conn);
    }
    return this.connection;
  }

  static getConnection(options = { }) {
    return this.connection;
  }
}

module.exports = ConnectionService;

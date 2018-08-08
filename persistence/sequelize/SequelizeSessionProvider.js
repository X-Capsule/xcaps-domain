/* eslint-disable global-require,import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const Sequelize = require('sequelize');
const clsHooked = require('cls-hooked');
const root = require('rootrequire');

const namespace = clsHooked.createNamespace('transaction-namespace');
let singleton;
Sequelize.useCLS(namespace);

/**
 * 通过给定的模型目录，读取该目录下所有模型文件路径
 * @method readModelFiles
 * @param {string} modelPath - 模型目录
 * @returns {Array.<string>}
 */
function readModelFiles(modelPath) {
  return fs
    .readdirSync(modelPath)
    .filter(file => (
      // 只解析模型目录下面后缀名为js并且不以下划线开头的文件
      (file.indexOf('.') !== 0) && (file.slice(-3) === '.js') && (file[0] !== '_')
    ))
    .map(file => path.join(modelPath, file));
}

/**
 * 导入模型
 * @method importModels
 * @param {Sequelize} sequelize - Sequelize实例对象
 * @param {Array.<string>} modelFiles - 模型文件路径
 * @returns {Object.<string, Sequelize.models>}
 */
function importModels(sequelize, modelFiles) {
  modelFiles.forEach((file) => {
    const { modelName, attributes, options } = require(file);
    sequelize.import(
      modelName,
      () => sequelize.define(modelName, attributes, options),
    );
  });
}

function bindAssociations(models, modelFiles) {
  modelFiles.forEach((file) => {
    const { associations } = require(file);
    if (!_.isEmpty(associations)) {
      _.forEach(associations, (association) => {
        association(models);
      });
    }
  });
}

/**
 * 对Sequelize进行了封装，在原有基础上提供了单例和多库的支持
 * @class
 */
class SequelizeSessionProvider {
  /**
   * SequelizeSessionProvider构造函数
   * @method constructor
   * @param {Object} connection - 建立数据库连接所需参数
   * @param {string} connection.database - 数据库名
   * @param {string} connection.username - 用户名
   * @param {string} connection.password - 登录密码
   * @param {string} connection.host - 主机名
   * @param {string} connection.port - 端口号
   * @param {string} modelPath - sequelize数据库表定义的相关目录
   * @param {Object} options - 可选参数
   */
  constructor(connection, modelPath, options) {
    if (_.isUndefined(singleton)) {
      singleton = {};
    }
    const selfModelPath = path.join(root, modelPath);
    const {
      database, username, password, host, port,
    } = connection;
    this.domain = `${host}:${port}/${database}`;

    let sequelize = singleton[this.domain];
    if (_.isUndefined(sequelize)) {
      const selfOptions = _.assign({
        host,
        port,
      }, options);
      sequelize = new Sequelize(
        database,
        username,
        password,
        selfOptions,
      );
      const modelFiles = readModelFiles(selfModelPath);
      importModels(sequelize, modelFiles);
      bindAssociations(sequelize.models, modelFiles);
      singleton[this.domain] = sequelize;
    }
  }

  session() {
    return singleton[this.domain];
  }
}

module.exports = SequelizeSessionProvider;

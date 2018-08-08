const uuid = require('uuid/v4');
const SessionContext = require('../lib/SessionContext');

/**
 * Entity(实体), 用于定义领域内部的一个领域模型, 表达一个最小的一个业务相关性的模型. 具体
 * 请参考
 */
class Entity extends SessionContext {
  /**
   * @constructor
   * @description 默认初始化构造函数, 该方法将会被 extending Entity 通过 super() 方法
   * 进行调用.
   */
  constructor(id) {
    super();
    this.id = id;
  }

  /**
   * @description 获取 Entity Id
   * @return {*}
   */
  get id() {
    return this.idValue;
  }

  set id(value) {
    this.idValue = value;
    if (this.idValue === undefined) {
      this.idValue = uuid();
    }
  }
}

module.exports = Entity;

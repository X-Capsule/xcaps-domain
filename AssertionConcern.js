const { assert } = require('chai');
const _ = require('lodash');

class AssertionConcern {
  constructor() {
    this.extendInstanceAssertion(AssertionConcern);
  }

  /**
   * @method extendInstanceAssertion
   * @description 该方法是将 Class static methods 扩展为 instance methods. 设计的初衷
   * 是为了模拟 Java 语法, Class instance 也可以访问 Class static methods.
   * @param ClassObj - 需要扩展的
   * @param indexKey
   */
  extendInstanceAssertion(ClassObj, indexKey = 'assert') {
    _.find([].concat(Object.getOwnPropertyNames(ClassObj)), (prop) => {
      const propPattern = new RegExp(indexKey);
      if (propPattern.test(prop)) {
        this[prop] = ClassObj[prop];
      }
    });
  }
  /**
   * @static assertIsTrue
   * @param value
   * @param message
   */
  static assertIsTrue(value, message) {
    assert.isTrue(value, message);
  }
  /**
   * @static assertIsNotToprue
   * @param value
   * @param message
   */
  static assertIsNotTrue(value, message) {
    assert.isNotTrue(value, message);
  }
  /**
   * @static assertArgumentNotEqual
   * @param actual
   * @param expected
   * @param message
   */
  static assertArgumentNotEqual(actual, expected, message) {
    assert.notEqual(actual, expected, message);
  }

  /**
   * @static assertOk
   * @param value
   * @param message
   */
  static assertOk(value, message) {
    assert.isOk(value, message);
  }

  /**
   * @static assertLengthOf
   * @param object
   * @param length
   * @param message
   */
  static assertLengthOf(object, length, message) {
    assert.lengthOf(object, length, message);
  }

  /**
   * @static assertArgumentEmpty
   * @param target
   * @param message
   */
  static assertArgumentEmpty(target, message) {
    assert.isEmpty(target, message);
  }

  /**
   * @static assertArgumentNotEmpty
   * @param target
   * @param message
   */
  static assertArgumentNotEmpty(target, message) {
    assert.isNotEmpty(target, message);
  }

  /**
   * @static assertArgumentAtLeast
   * @param valueToCheck
   * @param valueToBeAtLeast
   * @param message
   */
  static assertArgumentAtLeast(valueToCheck, valueToBeAtLeast, message) {
    assert.isAtLeast(valueToCheck, valueToBeAtLeast, message);
  }

  /**
   * @static assertArgumentAtMost
   * @param valueToCheck
   * @param valueToBeAtMost
   * @param message
   */
  static assertArgumentAtMost(valueToCheck, valueToBeAtMost, message) {
    assert.isAtMost(valueToCheck, valueToBeAtMost, message);
  }

  /**
   * @static assertArgumentLength
   * @param valueToCheck
   * @param valueToBeAtLeast
   * @param valueToBeAtMost
   * @param message
   */
  static assertArgumentLength(valueToCheck, valueToBeAtLeast, valueToBeAtMost, message) {
    assert.isAtLeast(valueToCheck, valueToBeAtLeast, message);
    assert.isAtMost(valueToCheck, valueToBeAtMost, message);
  }

  /**
   * @static assertInclude
   * @param collection
   * @param valueToCheck
   * @param message
   */
  static assertInclude(collection, valueToCheck, message) {
    assert.include(collection, valueToCheck, message);
  }

  /**
   * @static assertNotInclude
   * @param collection
   * @param valueToCheck
   * @param message
   */
  static assertNotInclude(collection, valueToCheck, message) {
    assert.notInclude(collection, valueToCheck, message);
  }
}

module.exports = AssertionConcern;

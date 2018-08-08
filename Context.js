const AssertionConcern = require('./AssertionConcern');

const contextStore = {
};

class Context extends AssertionConcern {
  constructor() {
    super();
    this.context = {};
  }
  static getValue(key) {
    return contextStore[key];
  }
  static setValue(key, value) {
    contextStore[key] = value;
  }
}

module.exports = Context;

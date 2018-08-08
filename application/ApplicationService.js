const SessionContext = require('../lib/SessionContext');
/**
 * DomainService(领域服务), 具体是用于实现关联领域内部 entities 的业务服务.
 */

class ApplicationService extends SessionContext {
  /**
   * @constructor
   * @param options
   */
  constructor(options = {}) {
    super();
  }
}

module.exports = ApplicationService;

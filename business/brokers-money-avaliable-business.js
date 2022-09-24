const BaseBusiness = require('./base-business');

/**
 * Example bussines job processor
 */
class TestBusiness extends BaseBusiness {
  /**
   * @param {object} job
   * @param {Log} log
   * @param {number} workerId
   * @return {void}
   */
  async process({
    job,
    log,
    workerId,
  }) {
    try {
      const { clientId } = job.data;

      log.debug(clientId);

      log.show(
        'yellow',
        `Worker: ${workerId} - ${job.id} - Finish job`,
      );
    } catch (error) {
      return this.sendToFallback({
        job,
        log,
        workerId,
        error,
      });
    }
  }
}

module.exports = TestBusiness;

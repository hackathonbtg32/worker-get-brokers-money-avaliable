const Request = require('../app/request');
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

      const req = new Request();
 
      const avaliableaccountvalueBrokers = await req.get(`/brokers/avaliablevalue/${clientId}`, {})
      const nextDebitsToPay = await req.get(`/debits/nextdebittopay/${clientId}`, {})
      console.log(clientId)
      console.log(nextDebitsToPay.data)

      let avaliableValues = 0;

      const clientBrokers = avaliableaccountvalueBrokers.data.data;
      for (let position in clientBrokers) {
        avaliableValues += clientBrokers[position].availableBrokerValue;
      }

      const debitValue = nextDebitsToPay.data.data.paymentValue

      if (avaliableValues < debitValue) {
        console.log('Não há saldo o suficiente para pagar os boleto')
        return
      }

      let remainValue = debitValue
      for (let position in clientBrokers) {
        const brokerAmmountValue = this.getValueFromBroker(
          clientBrokers[position]
        )

        if (brokerAmmountValue <= 0) {
          continue
        }

        if (brokerAmmountValue >= remainValue) {
          const newBrokerAmmountValue = brokerAmmountValue - remainValue
          this.retireFromBroker(clientBrokers[position].id, newBrokerAmmountValue)
          break
        }

        console.log(brokerAmmountValue - remainValue)
        if ((brokerAmmountValue - remainValue) < 0) {
          remainValue = remainValue - brokerAmmountValue

          const newBrokerAmmountValue = 0
          this.retireFromBroker(clientBrokers[position].id, newBrokerAmmountValue)
          continue
        }

        const newBrokerAmmountValue = brokerAmmountValue - remainValue
        this.retireFromBroker(clientBrokers[position].id, remainValue)
      }

      let paymentPayload = JSON.parse(nextDebitsToPay.data.data.paymentData, true)
      paymentPayload.paymentDate = new Date();
      paymentPayload.paymentPayedValue = debitValue
      paymentPayload.paymentStatus = 1;

      paymentPayload = JSON.stringify(paymentPayload);
      const payload = {
        paymentPayload,
        status: 1,
      }

      console.log(nextDebitsToPay.data.id)
      console.log(payload)
      await req.patch(`/debits/uptade/${nextDebitsToPay.data.id}`, payload)
    } catch (error) {
      return this.sendToFallback({
        job,
        log,
        workerId,
        error,
      });
    }
  }

  getValueFromBroker(broker) {
    return broker.availableBrokerValue
  }

  async retireFromBroker(brokerId, value) {
    const req = new Request();

    const body = {
      "availableBrokerValue": value
    }

    const nextDebitsToPay = await req.patch(`/broker/value/${brokerId}`, body)
  }
}

module.exports = TestBusiness;
 
const Axios = require('axios');
const axiosConfig = require('../config/axios.js')

class Request {
  constructor() {
    this.axios = Axios.create({
      baseURL: axiosConfig.baseURL,
      validateStatus: axiosConfig.validateStatus,
      headers: axiosConfig.headers,
    });
  }

  async get(
    endPoint,
    body
  ) {
    return await this.axios.get(endPoint, body)
  }

  async post(
    endPoint,
    body
  ) {
    return this.axios.post(endPoint, body)
  }

  async put(
    endPoint,
    body
  ) {
    return this.axios.put(endPoint, body)
  }

  async patch(
    endPoint,
    body
  ) {
    return this.axios.patch(endPoint, body)
  }
}

module.exports = Request;

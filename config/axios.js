const axiosConfig = {
  baseURL: process.env.BASE_URL || 'localhost:8080',
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    Authorization: process.env.API_AUTHORIZATION || '',
    'Content-Type': 'application/json',
  }
}

module.exports = axiosConfig

class ApiClient {
  constructor(requestContext) {
    this.request = requestContext;
  }

  async login(credentials) {
    const response = await this.request.post('/api/ecom/auth/login', {
      data: credentials
    });

    if (!response.ok()) {
      const responseBody = await response.text();

      throw new Error(
        `API login failed with HTTP ${response.status()}: ${responseBody}`
      );
    }

    const responseBody = await response.json();

    if (!responseBody.token) {
      throw new Error('API login succeeded but no token was returned.');
    }

    return responseBody;
  }

  async createOrder(token, orderPayload) {
    const response = await this.request.post('/api/ecom/order/create-order', {
      data: orderPayload,
      headers: {
        authorization: token,
        'content-type': 'application/json'
      }
    });

    if (!response.ok()) {
      const responseBody = await response.text();

      throw new Error(
        `Create-order API failed with HTTP ${response.status()}: ${responseBody}`
      );
    }

    return response.json();
  }
}

module.exports = { ApiClient };

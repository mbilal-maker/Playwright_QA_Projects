class ApiClient {
  constructor(requestContext) {
    this.request = requestContext;
  }

  async login({ userEmail, userPassword }) {
    const response = await this.request.post('/api/ecom/auth/login', {
      data: { userEmail, userPassword }
    });

    const responseText = await response.text();

    if (!response.ok()) {
      throw new Error(
        `API login failed with HTTP ${response.status()}: ${responseText}`
      );
    }

    let responseBody;

    try {
      responseBody = JSON.parse(responseText);
    } catch {
      throw new Error(`API login returned invalid JSON: ${responseText}`);
    }

    if (!responseBody.token) {
      throw new Error(`API login returned no token: ${responseText}`);
    }

    return responseBody;
  }
}

module.exports = { ApiClient };

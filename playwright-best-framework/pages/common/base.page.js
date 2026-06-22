class BasePage {
  constructor(page) {
    this.page = page;
  }

  async open(pathOrUrl = '') {
    await this.page.goto(pathOrUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
}

module.exports = { BasePage };

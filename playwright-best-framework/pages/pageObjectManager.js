const { DynamicLoadingPage } = require('./dynamic-loading/dynamicLoading.page');

class PageObjectManager {
  constructor(page) {
    this.page = page;
    this.dynamicLoadingPage = new DynamicLoadingPage(page);
  }

  getDynamicLoadingPage() {
    return this.dynamicLoadingPage;
  }
}

module.exports = { PageObjectManager };

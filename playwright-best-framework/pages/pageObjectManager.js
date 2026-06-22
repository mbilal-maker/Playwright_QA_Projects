const { DynamicLoadingPage } = require('./dynamic-loading/dynamicLoading.page');

class PageObjectManager {
  constructor(page) {
    this.page = page;
  }

  getDynamicLoadingPage() {
    return new DynamicLoadingPage(this.page);
  }
}

module.exports = { PageObjectManager };

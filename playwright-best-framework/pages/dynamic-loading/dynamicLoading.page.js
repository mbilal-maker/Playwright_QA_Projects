const { BasePage } = require('../common/base.page');
const { WaitHelper } = require('../../utils/wait.helper');
const { AssertionHelper } = require('../../utils/assertion.helper');

class DynamicLoadingPage extends BasePage {
  constructor(page) {
    super(page);
    this.startButton = page.getByTestId('start-button');
    this.loadingSpinner = page.getByTestId('loading-spinner');
    this.resultText = page.getByTestId('final-result');
  }

  async openSpinnerDemo() {
    await this.open('');
  }

  async verifyPageLoaded() {
    await AssertionHelper.expectVisible(this.startButton);
  }

  async clickStart() {
    await this.startButton.click();
  }

  async waitForSpinnerVisible() {
    await AssertionHelper.expectVisible(this.loadingSpinner);
  }

  async waitForSpinnerDisappear() {
    await WaitHelper.waitForLoaderToDisappear(this.loadingSpinner);
  }

  async verifyResultText(expectedText) {
    await AssertionHelper.expectVisible(this.resultText);
    await AssertionHelper.expectText(this.resultText, expectedText);
  }
}

module.exports = { DynamicLoadingPage };

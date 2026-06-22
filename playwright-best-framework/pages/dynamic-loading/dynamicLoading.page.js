const { BasePage } = require('../common/base.page');
const { WaitHelper } = require('../../utils/wait.helper');
const { AssertionHelper } = require('../../utils/assertion.helper');

class DynamicLoadingPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dynamically Loaded Page Elements' });
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.loadingSpinner = page.locator('#loading');
    this.resultText = page.locator('#finish');
  }

  async openDynamicLoadingExample(exampleNumber = 1) {
    await this.open(`/dynamic-loading/${exampleNumber}`);
  }

  async verifyPageLoaded() {
    await AssertionHelper.expectVisible(this.heading);
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
    await AssertionHelper.expectText(this.resultText, expectedText);
  }
}

module.exports = { DynamicLoadingPage };

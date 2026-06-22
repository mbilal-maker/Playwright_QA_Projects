const { test } = require('../../fixtures/test.fixture');
const dynamicLoadingData = require('../../data/test-data/dynamicLoading.data.json');

test.describe('Dynamic Loading Spinner - Framework Example', () => {
  test('Validate loader spinner disappears and final result is displayed', async ({ poManager }) => {
    const dynamicLoadingPage = poManager.getDynamicLoadingPage();

    await dynamicLoadingPage.openSpinnerDemo();
    await dynamicLoadingPage.verifyPageLoaded();
    await dynamicLoadingPage.clickStart();
    await dynamicLoadingPage.waitForSpinnerVisible();
    await dynamicLoadingPage.waitForSpinnerDisappear();
    await dynamicLoadingPage.verifyResultText(dynamicLoadingData.expectedResultText);
  });
});

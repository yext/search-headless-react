const { BrowserPageWidths } = require("./constants");

/**
 * Responsible for browser navigation based on given test locations.
 * Each test location is an object which may contain:
 * - name: name of this test
 * - page: the vertical page to navigate to (if omit, navigate to universal page by default)
 * - queryParams: the query params to peform the search on
 * - viewport: viewport of the page (if omit, desktop view is used by default)
 * - commands: a list of actions to perform on the page by the page navigator
 */
class PageOperator {
  /**
   * @param {PageNavigator} pageNavigator page navigator
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {Object[]} testLocations a list of test locations to navigate to
   */
  constructor(pageNavigator, page, testLocations) {
    this._pageNavigator = pageNavigator;
    this._page = page;
    this._testLocations = testLocations;
    this._testLocationIndex = -1;
  }

  hasNextTestLocation() {
    return this._testLocationIndex < this._testLocations.length - 1;
  }

  async nextTestLocation() {
    this._testLocationIndex++;
    const testConfig = this._testLocations[this._testLocationIndex];
    await this._setPageViewport(testConfig.viewport);
    testConfig.path
      ? await this._pageNavigator.gotoPage(testConfig.path)
      : await this._pageNavigator.gotoPage();
    await this._executeTestCommands(testConfig.commands);
    return testConfig;
  }

  async _setPageViewport(viewport) {
    if (viewport && !['desktop', 'mobile'].includes(viewport)) {
      throw Error(`unknown viewport: ${viewport}`);
    }
    viewport === 'mobile'
      ? await this._page.setViewport({ width: BrowserPageWidths.Mobile, height: this._page.viewport().height })
      : await this._page.setViewport({ width: BrowserPageWidths.Desktop, height: this._page.viewport().height });
  }

  async _executeTestCommands(commands) {
    if (!commands) {
      return;
    }
    for (const command of commands ) {
      await this._pageNavigator[command.type].apply(this._pageNavigator, command.params);
    }
  }
}

module.exports = PageOperator;

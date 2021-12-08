const { BrowserPageWidths } = require("./constants");

/**
 * Responsible for browser navigation based on given tests.
 */
class TestRunner {
  /**
   * @param {PageOperator} pageOperator page operator
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {Object[]} tests a list of tests to perform
   * @param {string} tests[].name test name
   * @param {string} tests[].path additional path to append to base url
   * @param {string} tests[].viewport viewport of the page (if omit, desktop view is used by default)
   * @param {Object[]} tests[].commands a list of actions to perform on the page by the page operator
   * @param {string} tests[].commands[].type function name to invoke from page operator
   * @param {any[]} tests[].commands[].params list of params to pass to the corresponding function in page operator
   */
  constructor(pageOperator, page, tests) {
    this._pageOperator = pageOperator;
    this._page = page;
    this._tests = tests;
    this._testIndex = -1;
  }

  hasNextTest() {
    return this._testIndex < this._tests.length - 1;
  }

  async nextTest() {
    this._testIndex++;
    const testConfig = this._tests[this._testIndex];
    await this._setPageViewport(testConfig.viewport);
    testConfig.path
      ? await this._pageOperator.gotoPage(testConfig.path)
      : await this._pageOperator.gotoPage();
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
      await this._pageOperator[command.type].apply(this._pageOperator, command.params);
    }
  }
}

module.exports = TestRunner;

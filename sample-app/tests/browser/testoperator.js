const { BrowserPageWidths } = require("./constants");

/**
 * Responsible for browser navigation based on given test instructions.
 */
class TestOperator {
  /**
   * @param {PageOperator} pageOperator page operator
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {Object[]} testInstructions a list of test instructions to perform
   * @param {string} testInstructions[].name test name
   * @param {string} testInstructions[].path additional path to append to base url
   * @param {string} testInstructions[].viewport viewport of the page (if omit, desktop view is used by default)
   * @param {string} testInstructions[].commands a list of actions to perform on the page by the page operator
   */
  constructor(pageOperator, page, testInstructions) {
    this._pageOperator = pageOperator;
    this._page = page;
    this._testInstructions = testInstructions;
    this._testInstructionIndex = -1;
  }

  hasNextTestInstruction() {
    return this._testInstructionIndex < this._testInstructions.length - 1;
  }

  async nextTestInstruction() {
    this._testInstructionIndex++;
    const testConfig = this._testInstructions[this._testInstructionIndex];
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

module.exports = TestOperator;

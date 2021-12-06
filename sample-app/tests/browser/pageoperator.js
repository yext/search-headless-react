const { waitTillHTMLRendered } = require('./utils');

/**
 * Responsible for interactions with an answers experience page.
 */
class PageOperator {
  /**
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {string} siteUrl A url to the index of the site
   */
  constructor(page, siteUrl) {
    this._page = page;
    this._siteUrl = siteUrl;
  }

  async gotoPage(path='') {
    const url = `${this._siteUrl}/${path}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async click(selector) {
    await this._page.click(selector);
    await waitTillHTMLRendered(this._page);
  }

  async type(input) {
    await this._page.keyboard.type(input);
    await waitTillHTMLRendered(this._page);
  }

  async search(input, inputSelector) {
    await this._page.click(inputSelector);
    await this._page.keyboard.type(input);
    await this._page.keyboard.press('Enter');
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = PageOperator;

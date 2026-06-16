// pages/AuthenticatedPage.ts
import { BasePage } from './BasePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Locator, Page } from '@playwright/test';

export class AuthenticatedPage extends BasePage {
  readonly header: Header;
  readonly footer: Footer;
  private readonly titleSpan: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.titleSpan = page.locator('[data-test="title"]');
  }

  getHeader(): Header {
    return this.header;
  }

  getFooter(): Footer {
    return this.footer;
  }

  async getSubTitle(): Promise<string | null> {
    return await this.titleSpan.textContent();
  }

  getTitleLocator(): Locator {
    return this.page.locator('[data-test="title"]');
  }

  async isPageLoaded(expectedTitle: string): Promise<boolean> {
    const currentTitle = await this.getSubTitle();
    return currentTitle === expectedTitle;
  }
}
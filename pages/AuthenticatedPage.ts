// pages/AuthenticatedPage.ts
import { BasePage } from './BasePage';
import { Header } from './components/Header';
import { Locator, Page } from '@playwright/test';

export class AuthenticatedPage extends BasePage {
  readonly header: Header;
  private readonly titleSpan: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.titleSpan = page.locator('[data-test="title"]');
  }

  getHeader(): Header {
    return this.header;
  }

  async getSubTitle(): Promise<string | null> {
    return await this.titleSpan.textContent();
  }
}
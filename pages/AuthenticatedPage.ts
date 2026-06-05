// pages/AuthenticatedPage.ts
import { BasePage } from './BasePage';
import { Header } from './components/Header';
import { Page } from '@playwright/test';

export class AuthenticatedPage extends BasePage {
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
  }

  getHeader(): Header {
    return this.header;
  }
}
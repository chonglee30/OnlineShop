import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';

export class InventoryPage extends AuthenticatedPage {
  readonly productSortContainer: Locator;

  constructor(page: Page) {
    super(page)
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.getSubTitle() === 'Products';
  }
}

// pages/checkout/StepTwoPage.ts
import { Page, Locator } from '@playwright/test';
import { AuthenticatedPage } from '../AuthenticatedPage';

// Checkout: Overview: Step Two Page
export class StepTwoPage extends AuthenticatedPage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = this.page.locator('[data-test="inventory-item"]');
    this.subtotal = this.page.locator('[data-test="subtotal-label"]');
    this.tax = this.page.locator('[data-test="tax-label"]');
    this.total = this.page.locator('[data-test="total-label"]');

    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async getTitle(): Promise<string | null> {
    return await this.title.textContent();
  }

  async getSubtotal(): Promise<string | null> {
    return await this.subtotal.textContent();
  }

  async getTax(): Promise<string | null> {
    return await this.tax.textContent();
  }

  async getTotal(): Promise<string | null> {
    return await this.total.textContent();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async cancel() { await this.cancelButton.click(); }
  async finish() { await this.finishButton.click(); }
}
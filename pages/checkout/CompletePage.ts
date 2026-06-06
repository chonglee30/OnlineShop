// pages/checkout/CompletePage.ts
import { Page, Locator } from '@playwright/test';
import { AuthenticatedPage } from '../AuthenticatedPage';

export class CompletePage extends AuthenticatedPage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async getCompleteMessage(): Promise<string | null> {
    return await this.completeHeader.textContent();
  }

  async isCompleteTextVisible(): Promise<boolean> {
    return await this.completeText.isVisible();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
    await this.page.waitForURL('**/inventory.html');
  }
}
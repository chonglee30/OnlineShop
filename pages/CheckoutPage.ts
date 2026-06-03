import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cartListItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.getByPlaceholder('First Name'); //page.locator('[data-test="firstName"]');
    this.lastNameInput = page.getByPlaceholder('Last Name'); //page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code'); //page.locator('[data-test="postalCode"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });   //page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cartListItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.waitFor({
      state: 'visible'
    });

    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async getTitle(): Promise<string | null> {
    return await this.title.textContent();
  }

  async getSubtotal(): Promise<string | null> {
    return await this.subtotalLabel.textContent();
  }

  async getTax(): Promise<string | null> {
    return await this.taxLabel.textContent();
  }

  async getTotal(): Promise<string | null> {
    return await this.totalLabel.textContent();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartListItems.count();
  }

  async getCompleteMessage(): Promise<string | null> {
    return await this.completeHeader.textContent();
  }

  async isCompleteTextVisible(): Promise<boolean> {
    return await this.completeText.isVisible();
  }
}

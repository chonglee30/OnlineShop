// pages/checkout/StepOnePage.ts
import { Page, Locator } from '@playwright/test';
import { AuthenticatedPage } from '../AuthenticatedPage';

// Checkout Information: Step One Page
export class StepOnePage extends AuthenticatedPage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/cart.html');
  }

  async continue(): Promise<void> {
    await this.continueButton.waitFor({
      state: 'visible'
    });

    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html');
  }
}
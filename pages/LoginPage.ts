import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logo } from './components/Logo';

export class LoginPage extends BasePage {
  readonly logo: Logo;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = new Logo(this.page.locator('.login_logo'));
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
  }

  async goToLoginPage(url: string) {
    // 1. Use 'domcontentloaded' to proceed once HTML is parsed.
    // 2. Set a specific timeout for this navigation if it is prone to hanging.
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000 // 15 seconds is usually enough for local navigation
    });

    // Use a "web-first" retry strategy
    await expect.poll(async () => {
      return await this.page.title();
    }, {
      message: 'Page title never matched',
      intervals: [500, 1000],
      timeout: 10000,
    }).toBe('Swag Labs');

    // 3. Keep the validation to ensure the page is actually ready for interaction
    await expect(this.page.locator('.login_logo')).toHaveText('Swag Labs')
  }

  async goToOtherPage(locator: string) {
    await this.page.goto(locator);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.loginButton.click(),
      this.page.waitForURL('**/inventory.html') // Wait for the expected destination
    ]);
  }

  async errorLogin(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // FIX: Remove waitForLoadState('networkidle')
    // Instead, wait for the expected outcome of the login action.
    // If the login is supposed to fail, wait for the error message to be visible:
    await expect(this.errorMessage).toBeVisible();
  }


  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async closeError(): Promise<void> {
    await this.errorButton.click();
  }
}

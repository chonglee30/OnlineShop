import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

const INVALID_PASSWORD = 'wrong_password';

test.describe('Authentication (Login)', () => {
  test.beforeEach(async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    loginPage.goToLoginPage(config.url)
  });

  test.describe('Positive Authentication (Login) Scenario', () => {
    // ========== SESSION & PERSISTENCE ==========
    test('After logout, cannot access inventory page directly', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.login(config.standard_user, config.valid_password);
      await page.waitForURL('**/inventory.html');
      await expect(page).toHaveURL(/inventory\.html/);
      expect(await inventoryPage.getSubTitle()).toContain('Products');

      // Logout
      await inventoryPage.getHeader().getBurgerMenu().logout();

      // Action: Try to access inventory page directly
      await page.goto(config.url + '/inventory.html');
      //expect(page.url()).not.toContain('inventory.html');
      await expect(page).toHaveURL(config.url);
    });
  });

  test.describe('Negative Authentication (Login) Scenario', () => {
    // ========== LOCKED OUT USER ==========
    test('Locked out user cannot login even with correct password', async ({ config, page }) => {
      const loginPage = new LoginPage(page);

      // Action: Attempt to login with locked_out_user
      await loginPage.login(config.locked_out_user, config.valid_password);

      // Verify: Login fails with error message
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Sorry, this user has been locked out');

      // Verify: Still on login page
      await expect(page).toHaveURL(config.url);
    });

    // ========== INVALID CREDENTIALS ==========
    test('Invalid password with valid username fails', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      // Action: Login with valid username but wrong password
      await loginPage.login(config.standard_user, INVALID_PASSWORD);

      // Verify: Error message displays
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username and password do not match');

      // Verify: Still on login page
      await expect(page).toHaveURL(config.url);
    });

    test('Invalid username fails to login', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      // Action: Login with non-existent username
      await loginPage.login('non_existent_user', config.valid_password);

      // Verify: Error message displays
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username and password do not match');

      // Verify: Still on login page
      await expect(page).toHaveURL(config.url);
    });

    test('Empty username field shows error', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.login('', config.valid_password);

      // Verify: Error message displays
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username is required');
    });

    test('Empty password field shows error', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.login(config.standard_user, '');

      // Verify: Error message displays
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Password is required');
    });

    test('Case sensitivity - username is case sensitive', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      // Action: Try login with uppercase username
      await loginPage.login('STANDARD_USER', config.valid_password);

      // Verify: Login fails (username is case sensitive)
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username and password do not match');
    });
  });
});

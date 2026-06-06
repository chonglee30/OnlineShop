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

  // ========== VALID USER LOGINS ==========
  test('Valid login with standard_user and correct password', async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Action: Fill credentials and login
    await loginPage.login(config.standard_user, config.valid_password);

    // Verify: Successfully logged in - redirected to inventory page
    await expect(page).toHaveURL(/inventory\.html/);

    // Verify: Inventory page is displayed
    const title = await inventoryPage.getSubTitle();
    expect(title).toContain('Products');
  });

  test('Valid login with error_user and correct password', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Fill credentials and login
    await loginPage.login(config.error_user, config.valid_password);
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Valid login with visual_user and correct password', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Fill credentials and login
    await loginPage.login(config.visual_user, config.valid_password);

    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // ========== LOCKED OUT USER ==========
  test('Locked out user cannot login even with correct password', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Attempt to login with locked_out_user
    await loginPage.usernameInput.fill(config.locked_out_user);
    await loginPage.passwordInput.fill(config.valid_password);
    await loginPage.loginButton.click();

    // Verify: Login fails with error message
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out');

    // Verify: Still on login page
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  // ========== INVALID CREDENTIALS ==========
  test('Invalid password with valid username fails', async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    // Action: Login with valid username but wrong password
    await loginPage.usernameInput.fill(config.standard_user);
    await loginPage.passwordInput.fill(INVALID_PASSWORD);
    await loginPage.loginButton.click();

    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');

    // Verify: Still on login page
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('Invalid username fails to login', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Login with non-existent username
    await loginPage.usernameInput.fill('non_existent_user');
    await loginPage.passwordInput.fill(config.valid_password);
    await loginPage.loginButton.click();

    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');

    // Verify: Still on login page
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('Empty username field shows error', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Leave username empty and try to login
    await loginPage.usernameInput.fill('');
    await loginPage.passwordInput.fill(config.valid_password);
    await loginPage.loginButton.click();

    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('Empty password field shows error', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Leave password empty and try to login
    await loginPage.usernameInput.fill(config.standard_user);
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();

    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Password is required');
  });

  test('Case sensitivity - username is case sensitive', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Try login with uppercase username
    await loginPage.usernameInput.fill('STANDARD_USER');
    await loginPage.passwordInput.fill(config.valid_password);
    await loginPage.loginButton.click();

    // Verify: Login fails (username is case sensitive)
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('Whitespace in username causes login to fail', async ({ config, page }) => {
    const loginPage = new LoginPage(page);

    // Action: Try login with username that has whitespace
    await loginPage.usernameInput.fill('  standard_user  ');
    await loginPage.passwordInput.fill(config.valid_password);
    await loginPage.loginButton.click();

    // Verify: Login fails
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // ========== SESSION & PERSISTENCE ==========
  test('After logout, cannot access inventory page directly', async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Setup: Login and logout
    await loginPage.login(config.standard_user, config.valid_password);
    await page.waitForURL('**/inventory.html');

    // Logout
    await inventoryPage.getHeader().getBurgerMenu().logout();

    // Action: Try to access inventory page directly
    await page.goto(config.url + '/inventory.html');
    console.log(page.url())
    expect(page.url()).not.toContain('inventory.html');
  });

  test('Cookies/session cleared after logout', async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Setup: Login
    await loginPage.login(config.standard_user, config.valid_password);
    await page.waitForURL('**/inventory.html');

    // Get session token from storage
    const sessionBefore = await page.evaluate(() => sessionStorage.getItem('session_id'));
    await inventoryPage.getHeader().getBurgerMenu().logout();

    // Verify: Session cleared
    const sessionAfter = await page.evaluate(() => sessionStorage.getItem('session_id'));
    expect(sessionAfter).toBeNull();
  });

  // ========== ERROR HANDLING & EDGE CASES ==========
  test('Error message displays with clear close button', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Action: Trigger error with invalid credentials
    await loginPage.usernameInput.fill('invalid');
    await loginPage.passwordInput.fill('invalid');
    await loginPage.loginButton.click();

    // Verify: Error message is visible
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    // Verify: Close button exists
    const closeButtonVisible = await loginPage.errorButton.isVisible();
    expect(closeButtonVisible).toBeTruthy();
  });

  test('Clicking error close button hides error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Action: Trigger error
    await loginPage.usernameInput.fill('invalid');
    await loginPage.passwordInput.fill('invalid');
    await loginPage.loginButton.click();

    // Verify: Error message visible
    let isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    // Action: Click close button
    await loginPage.closeError();

    // Verify: Error message is hidden
    isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeFalsy();
  });
});

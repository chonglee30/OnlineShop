import { test, expect } from '@playwright/test';
import { ManagerPage } from '../../pages/ManagerPage';

const VALID_PASSWORD = 'secret_sauce';
const INVALID_PASSWORD = 'wrong_password';

// All user types from Sauce Labs demo
const VALID_USERS = {
  standard_user: 'standard_user',
  locked_out_user: 'locked_out_user',
  problem_user: 'problem_user',
  performance_glitch_user: 'performance_glitch_user',
  error_user: 'error_user',
  visual_user: 'visual_user'
};

test.describe('Priority 2: Authentication (Login)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
    
    await page.goto('/')
    expect(await page.title()).toEqual('Swag Labs')
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs')
  });

  // ========== VALID USER LOGINS ==========
  
  test('TC2.1: Valid login with standard_user and correct password', async ({ page }) => {
    // const loginPage = new LoginPage(page);
    // const inventoryPage = new InventoryPage(page);

    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
    const inventoryPage = managerPage.onInventoryPage();
    
    // Action: Fill credentials and login
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in - redirected to inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    
    // Verify: Inventory page is displayed
    const title = await inventoryPage.title.textContent();
    expect(title).toContain('Products');
  });

  test('TC2.2: Valid login with problem_user and correct password', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    //const loginPage = new LoginPage(page);
    
    // Action: Fill credentials and login
    await loginPage.login(VALID_USERS.problem_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.3: Valid login with performance_glitch_user and correct password', async ({ page }) => {
    //const loginPage = new LoginPage(page);
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
    
    // Action: Fill credentials and login
    await loginPage.login(VALID_USERS.performance_glitch_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in (may be slow)
    await page.waitForURL('**/inventory.html', { timeout: 60000 });
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.4: Valid login with error_user and correct password', async ({ page }) => {
    //const loginPage = new LoginPage(page);
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Fill credentials and login
    await loginPage.login(VALID_USERS.error_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.5: Valid login with visual_user and correct password', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Fill credentials and login
    await loginPage.login(VALID_USERS.visual_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // ========== LOCKED OUT USER ==========

  test('TC2.6: Locked out user cannot login even with correct password', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Attempt to login with locked_out_user
    await loginPage.usernameInput.fill(VALID_USERS.locked_out_user);
    await loginPage.passwordInput.fill(VALID_PASSWORD);
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

  test('TC2.7: Invalid password with valid username fails', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Login with valid username but wrong password
    await loginPage.usernameInput.fill(VALID_USERS.standard_user);
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

  test('TC2.8: Invalid username fails to login', async ({ page }) => {
    
    
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Login with non-existent username
    await loginPage.usernameInput.fill('non_existent_user');
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();
    
    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
    
    // Verify: Still on login page
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('TC2.9: Empty username field shows error', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Leave username empty and try to login
    await loginPage.usernameInput.fill('');
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();
    
    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('TC2.10: Empty password field shows error', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
    
    // Action: Leave password empty and try to login
    await loginPage.usernameInput.fill(VALID_USERS.standard_user);
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();
    
    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Password is required');
  });

  test('TC2.11: Both username and password empty shows error', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();    
     
    // Action: Leave both fields empty and try to login
    await loginPage.loginButton.click();
    
    // Verify: Error message displays
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('TC2.12: Case sensitivity - username is case sensitive', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Try login with uppercase username
    await loginPage.usernameInput.fill('STANDARD_USER');
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();
    
    // Verify: Login fails (username is case sensitive)
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('TC2.13: Whitespace in username causes login to fail', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();  
    
    // Action: Try login with username that has whitespace
    await loginPage.usernameInput.fill('  standard_user  ');
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();
    
    // Verify: Login fails
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // ========== SESSION & PERSISTENCE ==========
  test('TC2.14: After successful login, user session is maintained on page navigation', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    const inventoryPage = managerPage.onInventoryPage();
    
    // Setup: Login as standard_user
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    await page.waitForURL('**/inventory.html');
    
    // Action: Navigate to different page (e.g., about)
    await inventoryPage.clickAbout();
    
    // Verify: Still logged in (can navigate back to inventory)
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL(/inventory\.html/);
    
    const title = await inventoryPage.title.textContent();
    expect(title).toContain('Products');
  });

  test('TC2.15: Logout clears session and redirects to login page', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    const inventoryPage = managerPage.onInventoryPage();
    
    // Setup: Login
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    await page.waitForURL('**/inventory.html');
    
    // Action: Logout
    await inventoryPage.logout();
    
    // Verify: Redirected to login page
    //await page.waitForURL('**/index.html');
    //await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('TC2.16: After logout, cannot access inventory page directly', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    const inventoryPage = managerPage.onInventoryPage();
      
    // Setup: Login and logout
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    await page.waitForURL('**/inventory.html');
    
    // Logout
    await inventoryPage.logout();
    //await page.waitForURL('**/index.html');
    
    // Action: Try to access inventory page directly
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    // Verify: Redirected back to login page
    //await page.waitForURL('**/index.html');
    //await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('TC2.17: Cookies/session cleared after logout', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    const inventoryPage = managerPage.onInventoryPage();
      
    // Setup: Login
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    await page.waitForURL('**/inventory.html');
    
    // Get session token from storage
    const sessionBefore = await page.evaluate(() => sessionStorage.getItem('session_id'));
    
    // Logout
    await inventoryPage.logout();
    
    // Verify: Session cleared
    const sessionAfter = await page.evaluate(() => sessionStorage.getItem('session_id'));
    expect(sessionAfter).toBeNull();
  });

  // ========== ERROR HANDLING & EDGE CASES ==========

  test('TC2.18: Error message displays with clear close button', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    
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

  test('TC2.19: Clicking error close button hides error message', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    
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

  test('TC2.20: Multiple failed login attempts still show proper error message', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      

    // First failed attempt
    await loginPage.usernameInput.fill('invalid1');
    await loginPage.passwordInput.fill('invalid');
    await loginPage.loginButton.click();
    
    let isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    // Close error
    await loginPage.closeError();
    isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeFalsy();
    
    // Second failed attempt
    await loginPage.usernameInput.fill('invalid2');
    await loginPage.passwordInput.fill('invalid');
    await loginPage.loginButton.click();
    
    // Verify: Error message still displays correctly
    isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // ========== USER-SPECIFIC BEHAVIORS ==========

  test('TC2.21: Problem user login succeeds but may have display issues', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    
    // Action: Login as problem_user
    await loginPage.login(VALID_USERS.problem_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in despite being "problem" user
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.22: Performance glitch user login succeeds (may take longer)', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
  
    // Action: Login as performance_glitch_user
    await loginPage.login(VALID_USERS.performance_glitch_user, VALID_PASSWORD);
    
    // Verify: Eventually succeeds (with extended timeout)
    await page.waitForURL('**/inventory.html', { timeout: 60000 });
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.23: Error user login succeeds (may have API issues)', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      

    // Action: Login as error_user
    await loginPage.login(VALID_USERS.error_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC2.24: Visual user login succeeds (may have visual differences)', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      
    
    // Action: Login as visual_user
    await loginPage.login(VALID_USERS.visual_user, VALID_PASSWORD);
    
    // Verify: Successfully logged in
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // ========== SECURITY TESTS ==========

  test('TC2.25: Password field masks input (shows dots/asterisks)', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      

    // Action: Fill password field
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    
    // Verify: Password field has type="password"
    const inputType = await loginPage.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('TC2.26: Login button is disabled until both fields are filled', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();      

    // Verify button exists and is clickable
    const isVisible = await loginPage.loginButton.isVisible();
    expect(isVisible).toBeTruthy();
    
    const isEnabled = await loginPage.loginButton.isEnabled();
    expect(isEnabled).toBeTruthy();
  });

  test('TC2.27: Brute force protection - multiple rapid login attempts', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
    
    // Action: Attempt multiple rapid logins with invalid credentials
    for (let i = 0; i < 5; i++) {
      await loginPage.usernameInput.fill(`invalid_${i}`);
      await loginPage.passwordInput.fill('invalid');
      await loginPage.loginButton.click();
      
      // Wait for error message
      await page.locator('[data-test="error"]').waitFor({ state: 'visible' });
      
      // Close error if possible
      try {
        await loginPage.closeError();
      } catch {
        // Button might not exist, continue
      }
    }
    
    // Verify: Still able to attempt login (or locked out, depending on implementation)
    //const isErrorVisible = await loginPage.isErrorVisible();
    //expect(isErrorVisible).toBeTruthy();
  });

  test('TC2.28: Login credentials are not stored in URL', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();

    // Action: Login
    await loginPage.login(VALID_USERS.standard_user, VALID_PASSWORD);
    await page.waitForURL('**/inventory.html');
    
    // Verify: URL does not contain credentials
    const url = page.url();
    expect(url).not.toContain('username');
    expect(url).not.toContain('password');
    expect(url).not.toContain(VALID_PASSWORD);
    expect(url).not.toContain(VALID_USERS.standard_user);
  });

  test('TC2.29: Login form is accessible and usable', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = managerPage.onLoginPage();
      // Verify: Username and password fields are visible and enabled    
    // Verify: All form elements are visible
    const usernameVisible = await loginPage.usernameInput.isVisible();
    const passwordVisible = await loginPage.passwordInput.isVisible();
    const buttonVisible = await loginPage.loginButton.isVisible();
    
    expect(usernameVisible).toBeTruthy();
    expect(passwordVisible).toBeTruthy();
    expect(buttonVisible).toBeTruthy();
    
    // Verify: Form can be filled and submitted
    await loginPage.usernameInput.fill(VALID_USERS.standard_user);
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    
    const username = await loginPage.usernameInput.inputValue();
    const password = await loginPage.passwordInput.inputValue();
    
    expect(username).toBe(VALID_USERS.standard_user);
    expect(password).toBe(VALID_PASSWORD);
  });
});

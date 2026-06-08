// # Author: Chong Lee 
import { test as setup } from '../fixtures/fixtures';
import { expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import fs from 'fs';
import path from 'path';

setup('Authenticate by UI', async ({ config, page }) => {
  // 1. Resolve an absolute path to ensure consistency
  const authFile = path.resolve(__dirname, '../.auth/user.json');

  // Ensure the directory exists
  const dir = path.dirname(authFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  await loginPage.goToLoginPage(config.url);
  await loginPage.login(config.standard_user, config.valid_password);
  await page.waitForURL('**/inventory.html');

  expect(await inventoryPage.isPageLoaded('Products')).toBeTruthy();
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();

  const state = await page.context().storageState({ path: authFile });
  fs.writeFileSync(authFile, JSON.stringify(state, null, 2), 'utf-8');
  // Test:
  //console.log('Auth state saved successfully to:', authFile);
  //console.log(require('fs').existsSync(authFile));
  //console.log(JSON.stringify(state, null, 2));
});

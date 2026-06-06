import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Authentication (Login)', () => {
  test.beforeEach(async ({ config, page }) => {
    const loginPage = new LoginPage(page);
    loginPage.goToLoginPage(config.url)
  });

  test.describe('Visual Validation of Inventory Page', () => {
    test('verify all product images in the inventory list with standard user', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Action: Fill credentials and login
      await loginPage.login(config.standard_user, config.valid_password);

      // Verify: Successfully logged in - redirected to inventory page
      await expect(page).toHaveURL(/inventory\.html/);

      // Verify: Inventory page is displayed
      const title = await inventoryPage.getSubTitle();
      expect(title).toContain('Products');

      const productImages = page.locator('.inventory_item_img img');
      const count = await productImages.count();

      console.log('Count:', count);
      expect(count).toBe(6);

      for (let i = 0; i < count; i++) {
        const img = productImages.nth(i);
        await expect(img).toBeVisible();
        const altText = await img.getAttribute('alt');
        const screenshotName = altText?.replace(/\s+/g, '-') + '.png';
        await expect(img).toHaveScreenshot(screenshotName, { maxDiffPixelRatio: 0.05 });
      }
    })

    test('problem user expect to fail visual comparison for product images', async ({ config, page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.login(config.problem_user, config.valid_password);
      await expect(page).toHaveURL(/inventory\.html/);

      const title = await inventoryPage.getSubTitle();
      expect(title).toContain('Products');

      const productImages = page.locator('.inventory_item_img img');
      const count = await productImages.count();

      console.log('Count:', count);
      expect(count).toBe(6);

      for (let i = 0; i < count; i++) {
        const img = productImages.nth(i);
        await expect(img).toBeVisible();
        const altText = await img.getAttribute('alt');
        const screenshotName = altText?.replace(/\s+/g, '-') + '.png';
        await expect(img).not.toHaveScreenshot(screenshotName, { maxDiffPixelRatio: 0.05 });
      }
    });
  });

  test.describe('Performance Validation', () => {
    test('performance_glitch_user should load within a reasonable time', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      const startTime = Date.now();

      // Login actions
      await loginPage.login('performance_glitch_user', 'secret_sauce');

      // Assert the load happens (with a generous limit for the glitch)
      await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 10000 });

      const duration = (Date.now() - startTime) / 1000;
      console.log(`Login took ${duration} seconds`);

      // Assert that it didn't take longer than the known glitch delay
      expect(duration).toBeLessThan(6);
    });
  });
});
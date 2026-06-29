import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures';
import { SOCIAL_LINKS } from '../../constants/socialLinks';

test.describe('Footer Link Year Validation', () => {
  test.beforeEach(async ({ config, managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage(config.url + '/inventory.html');
  });

  test('Validate all social media links and the current year displayed on the Inventory page.', async ({ managerPage }) => {
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkout = managerPage.onCheckout();

    await inventoryPage.footer.expectCurrentYear();
    for (const link of SOCIAL_LINKS) {
      const currentPage = await inventoryPage.footer.openSocialLink(link.name)
      await currentPage.close();
    }
  });

  test('Validate Header Layout displayed on the Inventory page.', async ({ managerPage }) => {
    const inventoryPage = managerPage.onInventoryPage();
    await expect(inventoryPage.header.getBurgerMenu().reactBtnMenu).toMatchAriaSnapshot(`- button "Open Menu"`);
    await inventoryPage.header.getBurgerMenu().reactBtnMenu.click()
    await expect(inventoryPage.header.getBurgerMenu().menuContainer).toMatchAriaSnapshot(`
       - navigation:
         - link "All Items":
           - /url: "#"
         - link "About":
           - /url: https://saucelabs.com/
         - link "Logout":
           - /url: "#"
         - link "Reset App State":
           - /url: "#"
    `)
  });
});
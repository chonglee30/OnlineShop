import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures';
import { SOCIAL_LINKS } from '../../constants/socialLinks';
import { ManagerPage } from '../../pages/manager/ManagerPage';

test.describe('Header and Footer Links Validation', () => {
  test.beforeEach(async ({ config, managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage(config.url + '/inventory.html');
  });

  test.describe('Footer Link Year Validation', () => {
    test('Validate all social media links and the current year displayed on the Inventory page.', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      await inventoryPage.footer.expectCurrentYear();
      for (const link of SOCIAL_LINKS) {
        const currentPage = await inventoryPage.footer.openSocialLink(link.name)
        await currentPage.close();
      }
    });

    test('Click the link inside twitter page', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const twitterPage = await inventoryPage.footer.openSocialLink('Twitter')
      await twitterPage.getByRole('link', { name: 'saucelabs.com' }).click();
      await expect(twitterPage).toHaveURL('https://saucelabs.com/');
      await twitterPage.close();
    })
  });

  test.describe('Header Link Validation', () => {
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
});


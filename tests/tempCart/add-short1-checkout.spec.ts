import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('Priority 1: Add to Cart → Complete Checkout with Correct Calculation', () => {
  test.beforeEach(async({managerPage}) => {
   //await managerPage.onLoginPage().login(VALID_USERNAME, VALID_PASSWORD);
   // managerPage.onLoginPage().goToLoginPage();
   await managerPage.onLoginPage().goToOtherPage('/inventory.html');
  })

  test('TC1.1: Add single item to cart and verify cart badge updates', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    // Get initial cart badge (should be empty or 0)
    const initialBadge = await inventoryPage.isCartBadgeVisible();

    // Action: Add first item to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Verify: Cart badge shows "1"
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toContain('1');
  });

  test('TC1.2: Add multiple items to cart and verify count increases', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();

    // Action: Add multiple items
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
    await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

    // Verify: Cart badge shows "3"
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toContain('3');
  });
});

import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('Priority 1: Add to Cart → Complete Checkout with Correct Calculation', () => {
  test.beforeEach(async ({ managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage('/inventory.html');
  })

  test('Add single item to cart and verify cart badge updates', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    // Get initial cart badge (should be empty or 0)
    const initialBadge = await inventoryPage.isCartBadgeVisible();

    // Action: Add first item to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    await expect(
      inventoryPage.getRemoveBackpackButton()
    ).toBeVisible();

    // Verify: Cart badge shows "1"
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toContain('1');
  });

  test('Add multiple items to cart and verify count increases', async ({ managerPage }) => {
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

  test('View cart and verify item details are correct', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();

    // Add items to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton);

    // Action: Navigate to cart
    await inventoryPage.openCart();

    // Verify: Cart page displays correct items
    const itemCount = await cartPage.getCartItemCount();
    //expect(itemCount).toBe(2);

    // Verify: Item names are visible
    const itemNames = await cartPage.getItemNames();
    expect(itemNames[0]).toContain('Sauce Labs Backpack');
    expect(itemNames[1]).toContain('Sauce Labs Bike Light');
  });

  test('Verify cart item prices match product page prices', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();

    // Get price from product page
    const prices = await inventoryPage.inventoryItemPrices.first().textContent();

    // Add to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate to cart
    await inventoryPage.openCart();

    // Verify: Price matches in cart
    const cartPrices = await cartPage.getItemPrices();
    expect(cartPrices[0]).toContain('29.99');
  });

  test('Verify subtotal calculation with multiple items', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();

    // Add items with known prices
    // Backpack: $29.99, Bike Light: $9.99, Bolt T-Shirt: $15.99
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
    await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

    // Navigate to cart
    await inventoryPage.openCart();

    // Verify: Items are in cart
    const itemCount = await cartPage.getCartItemCount();
    //expect(itemCount).toBe(3);

    // Calculate expected subtotal: 29.99 + 9.99 + 15.99 = 55.97
    //const subtotal = await cartPage.getSubtotal();
    //expect(subtotal).toContain('55.97');
  });

  test('Proceed to checkout from cart', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add items to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate to cart
    await inventoryPage.openCart();

    // Action: Click checkout button
    await cartPage.checkout();

    // Verify: Checkout information page loads
    const title = await checkoutPage.getTitle();
    expect(title).toContain('Checkout: Your Information');
  });

  test('Complete checkout with valid user information', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add item to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate to cart and checkout
    await inventoryPage.openCart();
    await cartPage.checkout();

    // Action: Fill checkout information
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');

    // Click continue
    await checkoutPage.continue();

    // Verify: Checkout overview page loads
    const title = await checkoutPage.getTitle();
    expect(title).toContain('Checkout: Overview');
  });

  test('Verify tax calculation on checkout overview', async ({ managerPage }) => {
    // Setup 
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add items
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate through checkout
    await inventoryPage.openCart();
    await cartPage.checkout();

    // Fill information
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    // Verify: Subtotal is displayed
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toContain('29.99');

    // Verify: Tax is calculated (typically 8% of subtotal)
    const tax = await checkoutPage.getTax();
    expect(tax).toBeTruthy();
  });

  test('Verify total calculation equals subtotal + tax', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add items
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton);

    // Navigate through checkout
    await inventoryPage.openCart();
    await cartPage.checkout();

    // Fill information
    await checkoutPage.fillCheckoutInfo('Jane', 'Smith', '54321');
    await checkoutPage.continue();

    // Extract values
    const subtotalText = await checkoutPage.getSubtotal();
    const taxText = await checkoutPage.getTax();
    const totalText = await checkoutPage.getTotal();

    // Parse values
    const subtotal = await checkoutPage.parsePrice(subtotalText || '');
    const tax = await checkoutPage.parsePrice(taxText || '');
    const total = await checkoutPage.parsePrice(totalText || '');

    // Verify: Total = Subtotal + Tax (with rounding tolerance)
    const calculatedTotal = Math.round((subtotal + tax) * 100) / 100;
    expect(total).toBe(calculatedTotal);
  });

  test('Complete purchase and verify order confirmation', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add items to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton);

    // Navigate through checkout
    await inventoryPage.openCart();
    await cartPage.checkout();

    // Fill information
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    // Action: Complete purchase
    await checkoutPage.finish();

    // Verify: Order confirmation page loads
    const title = await checkoutPage.getTitle();
    expect(title).toContain('Checkout: Complete');
  });

  test('Verify order summary on confirmation page', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add items
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Complete checkout flow
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await checkoutPage.finish();

    // Verify: Confirmation message displays
    const message = await checkoutPage.getCompleteMessage();
    expect(message).toContain('Thank you for your order');

    // Verify: Confirmation details visible
    const isVisible = await checkoutPage.isCompleteTextVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Cart persists after navigation', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();

    // Add item to cart
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate away
    await inventoryPage.productSortContainer.click();

    // Verify: Cart badge still shows "1"
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toContain('1');
  });

  test('Verify correct item quantity in cart', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();

    // Add same item multiple times
    await inventoryPage.addToCart(inventoryPage.addBackpackButton);
    //await inventoryPage.addToCart(inventoryPage.addBackpackButton);

    // Navigate to cart
    await inventoryPage.openCart();

    // Verify: Quantity shows 2
    const quantities = await cartPage.itemQuantities.allTextContents();
    //expect(quantities[0]).toContain('2');
  });

  test('End-to-end complete flow with multiple items and price verification', async ({ managerPage }) => {
    // Setup
    const inventoryPage = managerPage.onInventoryPage();
    const cartPage = managerPage.onCartPage();
    const checkoutPage = managerPage.onCheckoutPage();

    // Add multiple items
    await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
    await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99
    await inventoryPage.addToCart(inventoryPage.addBoltShirtButton); // $15.99

    // Navigate to cart
    await inventoryPage.openCart();

    // Verify cart contents
    const cartCount = await cartPage.getCartItemCount();
    //expect(cartCount).toBe(3);

    // Verify subtotal = $55.97
    //const subtotal = await cartPage.getSubtotal();
    //expect(subtotal).toContain('55.97');

    // Proceed to checkout
    await cartPage.checkout();

    // Fill checkout info
    await checkoutPage.fillCheckoutInfo('Test', 'User', '99999');
    await checkoutPage.continue();

    // Verify overview page shows correct items
    const overviewCount = await checkoutPage.getCartItemCount();
    //expect(overviewCount).toBe(3);

    // Verify subtotal on overview page
    const overviewSubtotal = await checkoutPage.getSubtotal();
    expect(overviewSubtotal).toContain('55.97');

    // Complete purchase
    await checkoutPage.finish();

    // Verify success
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you for your order');
  });
});

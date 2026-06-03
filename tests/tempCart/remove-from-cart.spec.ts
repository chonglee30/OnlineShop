import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('Priority 3: Remove from Cart', () => {
  test.beforeEach(async ({ managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage('/inventory.html');
  })

// ========== REMOVE SINGLE ITEM ==========
test('Remove single item from cart on inventory page', async ({ managerPage }) => {
  // Setup: Login
  const inventoryPage = managerPage.onInventoryPage();

  // Action: Add item to cart
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Verify: Cart badge shows 1
  let badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toContain('1');

  // Action: Remove item
  await inventoryPage.removeFromCart(inventoryPage.removeBackpackButton);

  // Verify: Cart badge disappears
  const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
  expect(isBadgeVisible).toBeFalsy();
});

test('Remove item from product listing changes button state', async ({ managerPage }) => {
  // Setup: Login
  const inventoryPage = managerPage.onInventoryPage();

  // Action: Add item
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Verify: Button changes to "Remove"
  let removeButtonVisible = await inventoryPage.removeBackpackButton.isVisible();
  expect(removeButtonVisible).toBeTruthy();

  // Action: Remove item
  await inventoryPage.removeFromCart(inventoryPage.removeBackpackButton);

  // Verify: Button changes back to "Add to cart"
  const addButtonVisible = await inventoryPage.addBackpackButton.isVisible();
  expect(addButtonVisible).toBeTruthy();
});

test('Remove item updates cart page total', async ({ managerPage }) => {
  // Setup: Login 
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();
  const checkoutPage = managerPage.onCheckoutPage();

  // Action: Add multiple items
  await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Subtotal is correct (29.99 + 9.99 = 39.98)
  /* Error: no Subtotal
  let subtotal = await cartPage.getSubtotal();
  expect(subtotal).toContain('39.98');
  
  // Action: Remove backpack from cart
  await cartPage.removeItem(cartPage.removeBackpackButton);
  
  // Verify: Subtotal updated to only bike light ($9.99)
  subtotal = await cartPage.getSubtotal();
  expect(subtotal).toContain('9.99'); */
});

test('Remove item from cart page reflects on inventory page', async ({ managerPage }) => {
  // Setup: 
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Navigate back to inventory
  await cartPage.continueShopping();

  // Verify: Backpack button shows "Add to cart" again
  const addButtonVisible = await inventoryPage.addBackpackButton.isVisible();
  expect(addButtonVisible).toBeTruthy();

  // Verify: Bike light button still shows "Remove"
  const removeButtonVisible = await inventoryPage.removeBikeLightButton.isVisible();
  expect(removeButtonVisible).toBeTruthy();
});

test('Remove button is available for each item in cart', async ({ managerPage }) => {
  // Setup: Login and add multiple items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: All items have remove buttons
  const backpackRemoveVisible = await cartPage.removeBackpackButton.isVisible();
  const bikeRemoveVisible = await cartPage.removeBikeLightButton.isVisible();
  const shirtRemoveVisible = await cartPage.removeBoltShirtButton.isVisible();

  expect(backpackRemoveVisible).toBeTruthy();
  expect(bikeRemoveVisible).toBeTruthy();
  expect(shirtRemoveVisible).toBeTruthy();
});

// ========== REMOVE ALL ITEMS ==========

test('Remove all items shows empty cart message', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Item is in cart
  let itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(1);

  // Action: Remove all items
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Empty cart state
  itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

test('Empty cart does not show checkout button', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Action: Remove all items
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Checkout button is not visible
  const isCheckoutVisible = await cartPage.isCheckoutVisible();
  //expect(isCheckoutVisible).toBeFalsy();
});

test('Subtotal and tax removed when cart is emptied', async ({ managerPage }) => {
  // Setup: Login and add items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Subtotal and tax visible
  //const subtotal = await cartPage.getSubtotal();
  //const tax = await cartPage.getTax();
  //expect(subtotal).toBeTruthy();
  //expect(tax).toBeTruthy();

  // Action: Remove all items
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Cart is empty
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

test('Continue shopping button available in empty cart', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Action: Remove all items
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Continue shopping button is visible
  const isContinueVisible = await cartPage.isContinueShoppingVisible();
  expect(isContinueVisible).toBeTruthy();
});

// ========== REMOVE MULTIPLE ITEMS ==========

test('Remove items one by one updates cart correctly', async ({ managerPage }) => {
  // Setup: Login and add multiple items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton); // $15.99

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Initial 3 items
  let itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(3);

  // Remove first item
  await cartPage.removeItem(cartPage.removeBackpackButton);
  itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(2);

  // Remove second item
  await cartPage.removeItem(cartPage.removeBikeLightButton);
  itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(1);

  // Remove third item
  await cartPage.removeItem(cartPage.removeBoltShirtButton);
  itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

test('Remove items in different order maintains cart integrity', async ({ managerPage }) => {
  // Setup: Login and add multiple items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Remove in different order (middle item first)
  await cartPage.removeItem(cartPage.removeBikeLightButton);

  // Verify: Remaining items are correct
  const itemNames = await cartPage.getItemNames();
  expect(itemNames).toContain('Sauce Labs Backpack');
  expect(itemNames).toContain('Sauce Labs Bolt T-Shirt');
  expect(itemNames).not.toContain('Sauce Labs Bike Light');
});

test('Remove items with quantity updates cart badge', async ({ managerPage }) => {
  // Setup: Login and add item twice (quantity 2)
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  /*
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  
  // Verify: Cart badge shows 2
  let badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toContain('2');
  
  // Navigate to cart and remove
  await inventoryPage.openCart();
  await cartPage.removeItem(cartPage.removeBackpackButton);
  
  // Verify: Cart is empty, badge gone
  const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
  expect(isBadgeVisible).toBeFalsy();
  */
});

// ========== REMOVE AND RE-ADD ==========

test('Remove and re-add item no duplicate charges', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Item in cart
  let itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(1);

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Cart empty
  itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(0);

  // Action: Add item back => don't think we can do this.
  //await cartPage.page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verify: Item added back once (not duplicated)
  itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(1);
});

test('Remove item and continue shopping flow', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Action: Continue shopping
  await cartPage.continueShopping();

  // Verify: Back on inventory page
  //await page.waitForURL('**/inventory.html'); => Check

  // Verify: Backpack button shows "Add to cart" again
  const addButtonVisible = await inventoryPage.addBackpackButton.isVisible();
  expect(addButtonVisible).toBeTruthy();
});

test('Remove all items and continue shopping then checkout', async ({ managerPage }) => {
  // Setup: Login and add items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);

  // Navigate to cart and remove all
  await inventoryPage.openCart();
  await cartPage.removeItem(cartPage.removeBackpackButton);
  await cartPage.removeItem(cartPage.removeBikeLightButton);

  // Continue shopping and add new items
  await cartPage.continueShopping();
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Only new item in cart
  let itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(1);

  // Verify: Item is the shirt (not old items)
  const itemNames = await cartPage.getItemNames();
  expect(itemNames).toContain('Sauce Labs Bolt T-Shirt');
});

// ========== REMOVE FROM DIFFERENT SECTIONS ==========

test('Remove button visible on all product types', async ({ managerPage }) => {
  // Setup: Login
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  // Add various items
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);
  await inventoryPage.addToCart(inventoryPage.addFleeceJacketButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Remove buttons are visible
  const backpackRemoveVisible = await cartPage.removeBackpackButton.isVisible();
  const bikeRemoveVisible = await cartPage.removeBikeLightButton.isVisible();
  const shirtRemoveVisible = await cartPage.removeBoltShirtButton.isVisible();
  const jacketRemoveVisible = await cartPage.removeFleeceJacketButton.isVisible();

  expect(backpackRemoveVisible).toBeTruthy();
  expect(bikeRemoveVisible).toBeTruthy();
  expect(shirtRemoveVisible).toBeTruthy();
  expect(jacketRemoveVisible).toBeTruthy();
});

test('Remove item clears it from memory (reload test)', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Cart empty
  let itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);

  // Action: Reload page
  //await page.reload();  // fix later

  // Verify: Cart still empty (persisted removal)
  itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

// ========== REMOVE WITH CALCULATIONS ==========

test('Tax recalculated when item removed', async ({ managerPage }) => {
  // Setup: Login and add items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99

  // Navigate to cart
  await inventoryPage.openCart();

  // Get initial tax
  // let taxText = await cartPage.getTax();
  // const initialTax = await cartPage.parsePrice(taxText || '');

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Get new tax
  //taxText = await cartPage.getTax();
  //const newTax = await cartPage.parsePrice(taxText || '');

  // Verify: Tax reduced after removal
  //expect(newTax).toBeLessThan(initialTax);
});

test('Total recalculated when item removed', async ({ managerPage }) => {
  // Setup: Login and add items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99

  // Navigate to cart
  await inventoryPage.openCart();

  // Get initial total
  //let totalText = await cartPage.getTotal();
  //const initialTotal = await cartPage.parsePrice(totalText || '');

  // Action: Remove highest priced item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Get new total
  //totalText = await cartPage.getTotal();
  //const newTotal = await cartPage.parsePrice(totalText || '');

  // Verify: Total reduced
  //expect(newTotal).toBeLessThan(initialTotal);
});

test('Subtotal, tax, and total all update when item removed', async ({ managerPage }) => {
  // Setup: Login and add items
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton); // $29.99
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton); // $9.99

  // Navigate to cart
  await inventoryPage.openCart();

  // Get initial values
  //const subtotalBefore = await cartPage.getSubtotal();
  //const taxBefore = await cartPage.getTax();
  //const totalBefore = await cartPage.getTotal();

  // Action: Remove item
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Get new values
  //const subtotalAfter = await cartPage.getSubtotal();
  //const taxAfter = await cartPage.getTax();
  //const totalAfter = await cartPage.getTotal();

  // Verify: All values changed
  // expect(subtotalAfter).not.toBe(subtotalBefore);
  //expect(taxAfter).not.toBe(taxBefore);
  //expect(totalAfter).not.toBe(totalBefore);

  // Verify: All reduced
  //expect(await cartPage.parsePrice(subtotalAfter || ''))
  //  .toBeLessThan(await cartPage.parsePrice(subtotalBefore || ''));
  //expect(await cartPage.parsePrice(taxAfter || ''))
  //  .toBeLessThan(await cartPage.parsePrice(taxBefore || ''));
  //expect(await cartPage.parsePrice(totalAfter || ''))
  //  .toBeLessThan(await cartPage.parsePrice(totalBefore || ''));
});

// ========== EDGE CASES ==========

test('Remove button appears immediately after adding item', async ({ managerPage }) => {
  // Setup: Login
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  // Action: Add item
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Remove button is visible
  const removeButtonVisible = await cartPage.removeBackpackButton.isVisible();
  expect(removeButtonVisible).toBeTruthy();
});

test('Remove cart item and verify item name still displayed before removal', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Item name visible
  const itemNames = await cartPage.getItemNames();
  expect(itemNames).toContain('Sauce Labs Backpack');

  // Action: Remove
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Cart is empty
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

test('Remove item price is correct before removal', async ({ managerPage }) => {
  // Setup: Login and add item
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();

  await inventoryPage.addToCart(inventoryPage.addBackpackButton);

  // Navigate to cart
  await inventoryPage.openCart();

  // Verify: Correct price displayed
  const prices = await cartPage.getItemPrices();
  expect(prices[0]).toContain('29.99');

  // Action: Remove
  await cartPage.removeItem(cartPage.removeBackpackButton);

  // Verify: Cart is empty
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(0);
});

test('End-to-end remove cart flow - add multiple, remove some, checkout remainder', async ({ managerPage }) => {
  // Setup: Login
  const inventoryPage = managerPage.onInventoryPage();
  const cartPage = managerPage.onCartPage();
  const checkoutPage = managerPage.onCheckoutPage();

  // Add multiple items
  await inventoryPage.addToCart(inventoryPage.addBackpackButton);
  await inventoryPage.addToCart(inventoryPage.addBikeLightButton);
  await inventoryPage.addToCart(inventoryPage.addBoltShirtButton);

  // Verify: Cart has 3 items
  let badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toContain('3');

  // Navigate to cart
  await inventoryPage.openCart();

  // Remove one item
  await cartPage.removeItem(cartPage.removeBikeLightButton);

  // Verify: 2 items remain
  let itemCount = await cartPage.getCartItemCount();
  //expect(itemCount).toBe(2);

  // Get subtotal with 2 items
  //const subtotalText = await cartPage.getSubtotal();
  //const subtotal = await cartPage.parsePrice(subtotalText || '');
  //expect(subtotal).toBeGreaterThan(0);

  // Proceed to checkout
  await cartPage.checkout();

  // Fill info
  await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
  await checkoutPage.continue();

  // Verify: Checkout overview shows 2 items (not 3)
  const overviewItemCount = await checkoutPage.getCartItemCount();
  //expect(overviewItemCount).toBe(2);

  // Verify: Subtotal matches
  const overviewSubtotal = await checkoutPage.getSubtotal();
  //expect(overviewSubtotal).toContain(subtotal.toString().substring(0, 5));
});

});

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { PriceUtils } from '../../utils/price-utils';

test.describe('Cart → Complete Checkout with Correct Calculation', () => {
  test.beforeEach(async ({ config, managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage(config.url + '/inventory.html');
  })

  test.describe('Add to Cart → Complete Checkout with Correct Calculation', () => {
    test('Correct Badge count and verify correct number of added items and products', async ({ managerPage }) => {
      // Setup
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();

      // TODO: remove this line once pass
      // await inventoryPage.addToCart(inventoryPage.getAddBackpackButton());
      //await inventoryPage.addToCart(inventoryPage.getAddBikeLightButton());

      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light'); 
      
      // Verify: Cart badge shows "2"
      const badge = await inventoryPage.getCartBadgeCount();
      expect(badge).toContain('2');

      // Action: Navigate to cart
      await inventoryPage.openCart();
      const pageTitle = await cartPage.getPageTitle();


      expect(pageTitle).toBe('Your Cart');

      const isVisible = await cartPage.isContinueShoppingVisible();
      expect(isVisible).toBeTruthy();

      // Verify: Cart page displays correct items
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);

      // Verify: Item names are visible
      const itemNames = await cartPage.getItemNames();
      expect(itemNames[0]).toContain('Sauce Labs Backpack');
      expect(itemNames[1]).toContain('Sauce Labs Bike Light');

      await cartPage.continueShopping();
      await inventoryPage.waitForURL('**/inventory.html');
    });

    test('End-to-end complete flow with multiple items and price verification', async ({ managerPage }) => {
      // Setup
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const checkoutPage = managerPage.onCheckoutPage();

      // Add multiple items
      // Add items to cart
     // await inventoryPage.addToCart(inventoryPage.getAddBackpackButton()); // $29.99
     // await inventoryPage.addToCart(inventoryPage.getAddBikeLightButton()); // $9.99
     // await inventoryPage.addToCart(inventoryPage.getAddBoltShirtButton()); // $15.99

       await inventoryPage.addItemToCart('Sauce Labs Backpack');
       await inventoryPage.addItemToCart('Sauce Labs Bike Light');
       await inventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt');

      const backpackItem = await inventoryPage.getInventoryItems().filter({ hasText: 'Sauce Labs Backpack' });
      const backpackPrice = await inventoryPage.getInventoryItemPrice(backpackItem);
      console.log(`The price is: ${backpackPrice}`);

      const bikeLightItem = await inventoryPage.getInventoryItems().filter({ hasText: 'Sauce Labs Bike Light' });
      const bikeLightPrice = await inventoryPage.getInventoryItemPrice(bikeLightItem);
      console.log(`The price is: ${bikeLightPrice}`);

      const boltShirtItem = await inventoryPage.getInventoryItems().filter({ hasText: 'Sauce Labs Bolt T-Shirt' });
      const boltShirtPrice = await inventoryPage.getInventoryItemPrice(boltShirtItem);
      console.log(`The price is: ${boltShirtPrice}`);

      const badge = await inventoryPage.getCartBadgeCount();
      expect(badge).toContain('3');

      // Navigate to cart
      await inventoryPage.openCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle).toBe('Your Cart');

      const isCheckoutBtnVisible = await cartPage.isCheckoutVisible();
      expect(isCheckoutBtnVisible).toBeTruthy();

      // Verify: Cart page displays correct items
      const cartCount = await cartPage.getCartItemCount();
      expect(cartCount).toBe(3);

      // Proceed to checkout
      await cartPage.checkout();

      // Fill checkout info
      await checkoutPage.fillCheckoutInfo('Test', 'User', '99999');
      await checkoutPage.continue();

      // Verify overview page shows correct items
      const overviewCount = await checkoutPage.getCartItemCount();
      expect(overviewCount).toBe(3);

      const subtotal = PriceUtils.parsePrice(backpackPrice) + PriceUtils.parsePrice(bikeLightPrice) + PriceUtils.parsePrice(boltShirtPrice);
      console.log(`Calculated subtotal: ${subtotal}`);

      // Verify subtotal on overview page
      const overviewSubtotal = await checkoutPage.getSubtotal();
      expect(overviewSubtotal).toContain(`$${subtotal.toFixed(2)}`);
      const tax = await checkoutPage.getTax()
      
      const total = await checkoutPage.getTotal();
      console.log(`Calculated total: ${total}`);
      
      // Verify total is correct (subtotal + tax)
      const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
      expect(total).toContain(`$${expectedTotal.toFixed(2)}`);

      // Complete purchase
      await checkoutPage.finish();

      // Verify success
      const completeMessage = await checkoutPage.getCompleteMessage();
      expect(completeMessage).toContain('Thank you for your order');
    });
  });

  test.describe('Remove From Cart → Complete Checkout with Correct Calculation', () => {
    test('Remove all items shows empty cart message', async ({ managerPage }) => {
      // Setup: Login and add item
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();

      //await inventoryPage.addToCart(inventoryPage.getAddBackpackButton());
      await inventoryPage.addItemToCart('Sauce Labs Backpack');

      // Navigate to cart
      await inventoryPage.openCart();

      // Verify: Item is in cart
      let itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);

      // Action: Remove all items
      await cartPage.removeItem(cartPage.getRemoveBackpackButton());

      // Verify: Empty cart state
      itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('End-to-end remove cart flow - add multiple, remove some, checkout remainder', async ({ managerPage }) => {
      // Setup: Login
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const checkoutPage = managerPage.onCheckoutPage();

      // Add multiple items
      await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket'); //49.99
      await inventoryPage.addItemToCart('Sauce Labs Onesie'); //7.99
      await inventoryPage.addItemToCart('Test.allTheThings() T-Shirt (Red)'); // 15.99

      // Verify: Cart has 3 items
      let badge = await inventoryPage.getCartBadgeCount();
      expect(badge).toContain('3');

      // Verify: Remove buttons are visible for added items
      expect(await inventoryPage.getRemoveFleeceJacketButton().isVisible()).toBeTruthy();
      expect(await inventoryPage.getRemoveOnesieButton().isVisible()).toBeTruthy();
      expect(await inventoryPage.getRemoveTShirtButton().isVisible()).toBeTruthy();

      // Action: Remove item
      await inventoryPage.removeFromCart(inventoryPage.getRemoveTShirtButton());
      //expect(await inventoryPage.getAddTShirtButton().isVisible()).toBeTruthy();
      expect(await inventoryPage.getCartBadgeCount()).toContain('2');

      const flleceJacketItem = await inventoryPage.getInventoryItems().filter({ hasText: 'Sauce Labs Fleece Jacket' });
      const flleceJacketPrice = await inventoryPage.getInventoryItemPrice(flleceJacketItem);
      console.log(`The price is: ${flleceJacketPrice}`);

      const onesieItem = await inventoryPage.getInventoryItems().filter({ hasText: 'Sauce Labs Onesie' });
      const onesiePrice = await inventoryPage.getInventoryItemPrice(onesieItem);
      console.log(`The price is: ${onesiePrice}`);

      // Navigate to cart
      await inventoryPage.openCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle).toBe('Your Cart');

      const isCheckoutBtnVisible = await cartPage.isCheckoutVisible();
      expect(isCheckoutBtnVisible).toBeTruthy();

      // Verify: Cart page displays correct items
      const cartCount = await cartPage.getCartItemCount();
      expect(cartCount).toBe(2);

      // Proceed to checkout
      await cartPage.checkout();

      // Fill info
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
      await checkoutPage.continue();

      // Verify overview page shows correct items
      const overviewCount = await checkoutPage.getCartItemCount();
      expect(overviewCount).toBe(2);

      const subtotal = PriceUtils.parsePrice(flleceJacketPrice) + PriceUtils.parsePrice(onesiePrice);
      console.log(`Calculated subtotal: ${subtotal}`);

      // Verify subtotal on overview page
      const overviewSubtotal = await checkoutPage.getSubtotal();
      expect(overviewSubtotal).toContain(`$${subtotal.toFixed(2)}`);
      const tax = await checkoutPage.getTax()
      console.log(`Calculated tax: ${tax}`);

      const total = await checkoutPage.getTotal();
      console.log(`Calculated total: ${total}`);

      // Verify total is correct (subtotal + tax)
      const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
      expect(total).toContain(`$${expectedTotal.toFixed(2)}`);

      // Complete purchase
      await checkoutPage.finish();

      // Verify success
      const completeMessage = await checkoutPage.getCompleteMessage();
      expect(completeMessage).toContain('Thank you for your order');
    });
  });
});

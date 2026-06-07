import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { PriceUtils } from '../../utils/price-utils';

test.describe('Cart → Complete Checkout with Correct Calculation', () => {
  test.beforeEach(async ({ config, managerPage }) => {
    await managerPage.onLoginPage().goToOtherPage(config.url + '/inventory.html');
  })

  test.describe('Add to Cart → Complete Checkout with Correct Calculation', () => {
    test('Correct Badge count and verify correct number of added items and products', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const productHelper = managerPage.getProductHelper();

      const backpackName = (await productHelper.getProductDetails('Sauce Labs Backpack')).name;
      const backpackPrice = (await productHelper.getProductDetails('Sauce Labs Backpack')).price;
      const bikeLightName = (await productHelper.getProductDetails('Sauce Labs Bike Light')).name;
      const bikeLightPrice = (await productHelper.getProductDetails('Sauce Labs Bike Light')).price;

      await productHelper.addItemToCart('Sauce Labs Backpack');
      await productHelper.addItemToCart('Sauce Labs Bike Light');
      await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
      await expect(productHelper.getRemoveButton('Sauce Labs Bike Light')).toBeVisible();
      expect(await inventoryPage.getHeader().getCart().getCartBadgeCount()).toEqual(2);

      await inventoryPage.getHeader().getCart().openCart();
      await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
      expect(await cartPage.isContinueShoppingVisible()).toBeTruthy();
      expect(await cartPage.getCartItemCount()).toBe(2);

      const itemNames = await cartPage.getItemNames();
      expect(itemNames[0]).toContain(backpackName);
      expect(itemNames[1]).toContain(bikeLightName);

      const itemPrices = await cartPage.getItemPrices();
      expect(itemPrices[0]).toContain(backpackPrice);
      expect(itemPrices[1]).toContain(bikeLightPrice);

      await cartPage.continueShopping();
      await inventoryPage.waitForURL('**/inventory.html');
    });

    test('End-to-end complete flow with multiple items and price verification', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const checkout = managerPage.onCheckout();
      const productHelper = managerPage.getProductHelper();

      const backpackName = (await productHelper.getProductDetails('Sauce Labs Backpack')).name;
      const backpackPrice = (await productHelper.getProductDetails('Sauce Labs Backpack')).price;
      const bikeLightName = (await productHelper.getProductDetails('Sauce Labs Bike Light')).name;
      const bikeLightPrice = (await productHelper.getProductDetails('Sauce Labs Bike Light')).price;
      const boltShirtName = (await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).name;
      const boltShirtPrice = (await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).price;

      await productHelper.addItemToCart('Sauce Labs Backpack'); // $29.99
      await productHelper.addItemToCart('Sauce Labs Bike Light'); // $9.99
      await productHelper.addItemToCart('Sauce Labs Bolt T-Shirt'); // $15.99
      await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
      await expect(productHelper.getRemoveButton('Sauce Labs Bike Light')).toBeVisible();
      await expect(productHelper.getRemoveButton('Sauce Labs Bolt T-Shirt')).toBeVisible();
      expect(await inventoryPage.getHeader().getCart().getCartBadgeCount()).toEqual(3);

      // Navigate to cart
      await inventoryPage.getHeader().getCart().openCart();
      await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
      expect(await cartPage.getHeader().getCart().getCartBadgeCount()).toEqual(3);
      // Verify: Cart page displays correct items
      expect(await cartPage.getCartItemCount()).toBe(3);
      expect((await productHelper.getProductDetails('Sauce Labs Backpack')).name).toEqual(backpackName)
      expect((await productHelper.getProductDetails('Sauce Labs Backpack')).price).toEqual(backpackPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Bike Light')).name).toEqual(bikeLightName)
      expect((await productHelper.getProductDetails('Sauce Labs Bike Light')).price).toEqual(bikeLightPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).name).toEqual(boltShirtName)
      expect((await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).price).toEqual(boltShirtPrice)

      expect(await cartPage.isCheckoutVisible()).toBeTruthy();
      await cartPage.checkout();

      // Fill checkout info
      await expect(checkout.stepOne.getTitleLocator()).toHaveText('Checkout: Your Information');
      expect(await checkout.stepOne.getHeader().getCart().getCartBadgeCount()).toEqual(3);
      await checkout.stepOne.fillCheckoutInfo('Test', 'User', '99999');
      await checkout.stepOne.continue();

      // Verify overview page shows correct items
      await expect(checkout.stepTwo.getTitleLocator()).toHaveText('Checkout: Overview');
      expect(await checkout.stepTwo.getHeader().getCart().getCartBadgeCount()).toEqual(3);
      expect(await checkout.stepTwo.getCartItemCount()).toBe(3);
      expect((await productHelper.getProductDetails('Sauce Labs Backpack')).name).toEqual(backpackName)
      expect((await productHelper.getProductDetails('Sauce Labs Backpack')).price).toEqual(backpackPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Bike Light')).name).toEqual(bikeLightName)
      expect((await productHelper.getProductDetails('Sauce Labs Bike Light')).price).toEqual(bikeLightPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).name).toEqual(boltShirtName)
      expect((await productHelper.getProductDetails('Sauce Labs Bolt T-Shirt')).price).toEqual(boltShirtPrice)

      const subtotal = PriceUtils.parsePrice(backpackPrice) + PriceUtils.parsePrice(bikeLightPrice) + PriceUtils.parsePrice(boltShirtPrice);
      const overviewSubtotal = await checkout.stepTwo.getSubtotal();
      expect(overviewSubtotal).toContain(`$${subtotal.toFixed(2)}`);
      const tax = await checkout.stepTwo.getTax();
      const total = await checkout.stepTwo.getTotal();

      // Verify total is correct (subtotal + tax)
      const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
      expect(total).toContain(`$${expectedTotal.toFixed(2)}`);
      await checkout.stepTwo.finish();

      await expect(cartPage.getTitleLocator()).toHaveText('Checkout: Complete!');
      expect(await checkout.complete.getHeader().getCart().getCartBadgeCount()).toEqual(0);
      expect(await checkout.complete.getCompleteMessage()).toContain('Thank you for your order');
    });
  });

  test.describe('Remove From Cart → Complete Checkout with Correct Calculation', () => {
    test('Remove all items shows empty cart message', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const productHelper = managerPage.getProductHelper();

      await productHelper.addItemToCart('Sauce Labs Backpack');
      await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
      expect(await inventoryPage.getHeader().getCart().getCartBadgeCount()).toEqual(1);
      await inventoryPage.getHeader().getCart().openCart();

      expect(await cartPage.getCartItemCount()).toBe(1);
      await productHelper.removeItemFromCart('Sauce Labs Backpack');
      expect(await cartPage.getCartItemCount()).toBe(0);
      expect(await cartPage.getHeader().getCart().getCartBadgeCount()).toEqual(0);
    });

    test('End-to-end remove cart flow - add multiple, remove some, checkout remainder', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const checkout = managerPage.onCheckout();
      const productHelper = managerPage.getProductHelper();

      const fleeceJacketName = (await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).name;
      const fleeceJacketPrice = (await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).price;
      const onesieName = (await productHelper.getProductDetails('Sauce Labs Onesie')).name;
      const onesiePrice = (await productHelper.getProductDetails('Sauce Labs Onesie')).price;
      const allShirtName = (await productHelper.getProductDetails('Test.allTheThings() T-Shirt (Red)')).name;
      const allShirtPrice = (await productHelper.getProductDetails('Test.allTheThings() T-Shirt (Red)')).price;

      await productHelper.addItemToCart('Sauce Labs Fleece Jacket'); //49.99
      await productHelper.addItemToCart('Sauce Labs Onesie'); //7.99
      await productHelper.addItemToCart('Test.allTheThings() T-Shirt (Red)'); // 15.99
      await expect(productHelper.getRemoveButton('Sauce Labs Fleece Jacket')).toBeVisible();
      await expect(productHelper.getRemoveButton('Sauce Labs Onesie')).toBeVisible();
      await expect(productHelper.getRemoveButton('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
      expect(await inventoryPage.getHeader().getCart().getCartBadgeCount()).toEqual(3);

      await productHelper.removeItemFromCart('Test.allTheThings() T-Shirt (Red)');
      await expect(productHelper.getAddButton('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
      expect(await inventoryPage.getHeader().getCart().getCartBadgeCount()).toEqual(2);
      await inventoryPage.getHeader().getCart().openCart();

      await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
      expect(await cartPage.isCheckoutVisible()).toBeTruthy();
      expect(await cartPage.getCartItemCount()).toBe(2);
      expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).name).toEqual(fleeceJacketName)
      expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).price).toEqual(fleeceJacketPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Onesie')).name).toEqual(onesieName)
      expect((await productHelper.getProductDetails('Sauce Labs Onesie')).price).toEqual(onesiePrice)
      await cartPage.checkout();

      // Fill info
      await expect(checkout.stepOne.getTitleLocator()).toHaveText('Checkout: Your Information');
      expect(await checkout.stepOne.getHeader().getCart().getCartBadgeCount()).toEqual(2);
      await checkout.stepOne.fillCheckoutInfo('John', 'Doe', '12345');
      await checkout.stepOne.continue();

      // Verify overview page shows correct items
      await expect(checkout.stepTwo.getTitleLocator()).toHaveText('Checkout: Overview');
      expect(await checkout.stepTwo.getHeader().getCart().getCartBadgeCount()).toEqual(2);
      expect(await checkout.stepTwo.getCartItemCount()).toBe(2);
      expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).name).toEqual(fleeceJacketName)
      expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).price).toEqual(fleeceJacketPrice)
      expect((await productHelper.getProductDetails('Sauce Labs Onesie')).name).toEqual(onesieName)
      expect((await productHelper.getProductDetails('Sauce Labs Onesie')).price).toEqual(onesiePrice)

      const subtotal = PriceUtils.parsePrice(fleeceJacketPrice) + PriceUtils.parsePrice(onesiePrice);
      const overviewSubtotal = await checkout.stepTwo.getSubtotal();
      expect(overviewSubtotal).toContain(`$${subtotal.toFixed(2)}`);
      const tax = await checkout.stepTwo.getTax()

      const total = await checkout.stepTwo.getTotal();
      console.log(`Calculated total: ${total}`);
      const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
      expect(total).toContain(`$${expectedTotal.toFixed(2)}`);

      await checkout.stepTwo.finish();
      await expect(checkout.complete.getTitleLocator()).toHaveText('Checkout: Complete!');
      expect(await checkout.complete.getHeader().getCart().getCartBadgeCount()).toEqual(0);
      expect(await checkout.complete.getCompleteMessage()).toContain('Thank you for your order');
    });
  });
});

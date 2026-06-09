import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures';
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

      await test.step("Add Products to cart and check badge count in the Inventory page", async () => {
        await productHelper.addItemToCart('Sauce Labs Backpack');
        await productHelper.addItemToCart('Sauce Labs Bike Light');
        await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
        await expect(productHelper.getRemoveButton('Sauce Labs Bike Light')).toBeVisible();
        if (await inventoryPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(inventoryPage.getHeader().getCart().getCartBadge()).toHaveText('2');
        }
      });

      await test.step("Check carted products name and price in the cart page", async () => {
        await inventoryPage.getHeader().getCart().openCart();
        await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
        await expect(cartPage.getCartItems()).toHaveCount(2)
        await expect(cartPage.inventoryItemNames).toHaveText([
          backpackName!,
          bikeLightName!
        ]);
        await expect(cartPage.inventoryItemPrices).toHaveText([
          backpackPrice!,
          bikeLightPrice!
        ]);
        if (await cartPage.isContinueShoppingVisible()) await cartPage.continueShopping();
        await inventoryPage.waitForURL('**/inventory.html');
      });
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

      await test.step("Add Products to cart and check badge count in the Inventory page", async () => {
        await productHelper.addItemToCart('Sauce Labs Backpack'); // $29.99
        await productHelper.addItemToCart('Sauce Labs Bike Light'); // $9.99
        await productHelper.addItemToCart('Sauce Labs Bolt T-Shirt'); // $15.99
        await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
        await expect(productHelper.getRemoveButton('Sauce Labs Bike Light')).toBeVisible();
        await expect(productHelper.getRemoveButton('Sauce Labs Bolt T-Shirt')).toBeVisible();
        if (await inventoryPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(inventoryPage.getHeader().getCart().getCartBadge()).toHaveText('3');
        }
      });

      await test.step("Check carted products name and price in the cart page", async () => {
        await inventoryPage.getHeader().getCart().openCart();
        await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
        if (await cartPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(cartPage.getHeader().getCart().getCartBadge()).toHaveText('3');
        }

        await expect(cartPage.getCartItems()).toHaveCount(3)
        await expect(cartPage.inventoryItemNames).toHaveText([
          backpackName!,
          bikeLightName!,
          boltShirtName!
        ]);
        await expect(cartPage.inventoryItemPrices).toHaveText([
          backpackPrice!,
          bikeLightPrice!,
          boltShirtPrice!
        ]);
        if (await cartPage.isCheckoutVisible()) await cartPage.checkout();
      });

      await test.step("Fill required checkout information and check badge count", async () => {
        await expect(checkout.stepOne.getTitleLocator()).toHaveText('Checkout: Your Information');
        if (await checkout.stepOne.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.stepOne.getHeader().getCart().getCartBadge()).toHaveText('3');
        }
        await checkout.stepOne.fillCheckoutInfo('Test', 'User', '99999');
        await checkout.stepOne.continue();
      });

      await test.step("Last check: checked out products names and prices and calculation and badge count", async () => {
        await expect(checkout.stepTwo.getTitleLocator()).toHaveText('Checkout: Overview');
        if (await checkout.stepTwo.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.stepTwo.getHeader().getCart().getCartBadge()).toHaveText('3');
        }
        await expect(checkout.stepTwo.cartItems).toHaveCount(3)
        await expect(productHelper.inventoryItemNames).toHaveText([
          backpackName!,
          bikeLightName!,
          boltShirtName!
        ]);
        await expect(productHelper.inventoryItemPrices).toHaveText([
          backpackPrice!,
          bikeLightPrice!,
          boltShirtPrice!
        ]);
        const subtotal = PriceUtils.parsePrice(backpackPrice) + PriceUtils.parsePrice(bikeLightPrice) + PriceUtils.parsePrice(boltShirtPrice);
        const overviewSubtotal = await checkout.stepTwo.getSubtotal();
        await expect(checkout.stepTwo.subtotal).toContainText(`$${subtotal.toFixed(2)}`)

        const tax = await checkout.stepTwo.getTax();
        const total = await checkout.stepTwo.getTotal();
        const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
        await expect(checkout.stepTwo.total).toContainText(`$${expectedTotal.toFixed(2)}`);
        await checkout.stepTwo.finish();
      });

      await test.step("Complete Checkout: final msg and check 0 badge count", async () => {
        await expect(checkout.complete.getTitleLocator()).toHaveText('Checkout: Complete!');
        if (await checkout.complete.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.complete.getHeader().getCart().getCartBadge()).toHaveText('0');
        }
        await expect(checkout.complete.completeHeader).toHaveText('Thank you for your order!')
      });
    });
  });

  test.describe('Remove From Cart → Complete Checkout with Correct Calculation', () => {
    test('Remove all items shows empty cart message', async ({ managerPage }) => {
      const inventoryPage = managerPage.onInventoryPage();
      const cartPage = managerPage.onCartPage();
      const productHelper = managerPage.getProductHelper();
      await test.step("Add Products to cart and check badge count in the Inventory page", async () => {
        await productHelper.addItemToCart('Sauce Labs Backpack');
        await expect(productHelper.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
        if (await inventoryPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(inventoryPage.getHeader().getCart().getCartBadge()).toHaveText('1');
        }
        await inventoryPage.getHeader().getCart().openCart();
      });

      await test.step("Remove item from Cart and check 0 badge count and cartItems in the cart page", async () => {
        await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
        await expect(cartPage.getCartItems()).toHaveCount(1)
        await productHelper.removeItemFromCart('Sauce Labs Backpack');
        await expect(cartPage.getCartItems()).toHaveCount(0)
        if (await cartPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(cartPage.getHeader().getCart().getCartBadge()).toHaveText('0');
        }
      });
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

      await test.step("Add 3 Products and remove 1 product from cart and check badge count in the Inventory page", async () => {
        await productHelper.addItemToCart('Sauce Labs Fleece Jacket'); //49.99
        await productHelper.addItemToCart('Sauce Labs Onesie'); //7.99
        await productHelper.addItemToCart('Test.allTheThings() T-Shirt (Red)'); // 15.99
        await expect(productHelper.getRemoveButton('Sauce Labs Fleece Jacket')).toBeVisible();
        await expect(productHelper.getRemoveButton('Sauce Labs Onesie')).toBeVisible();
        await expect(productHelper.getRemoveButton('Test.allTheThings() T-Shirt (Red)')).toBeVisible();

        if (await cartPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(cartPage.getHeader().getCart().getCartBadge()).toHaveText('3');
        }
        await productHelper.removeItemFromCart('Test.allTheThings() T-Shirt (Red)');
        await expect(productHelper.getAddButton('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
        await expect(cartPage.getHeader().getCart().getCartBadge()).toHaveText('2');
        await inventoryPage.getHeader().getCart().openCart();
      });

      await test.step("Check carted products name and price in the cart page", async () => {
        await expect(cartPage.getTitleLocator()).toHaveText('Your Cart');
        if (await cartPage.getHeader().getCart().isCartBadgeVisible()) {
          await expect(cartPage.getHeader().getCart().getCartBadge()).toHaveText('2');
        }
        await expect(cartPage.getCartItems()).toHaveCount(2)
        await expect(cartPage.inventoryItemNames).toHaveText([
          fleeceJacketName!,
          onesieName!
        ]);
        await expect(cartPage.inventoryItemPrices).toHaveText([
          fleeceJacketPrice!,
          onesiePrice!
        ]);
        if (await cartPage.isCheckoutVisible()) await cartPage.checkout();
      });

      await test.step("Fill required checkout information and check badge count", async () => {
        await expect(checkout.stepOne.getTitleLocator()).toHaveText('Checkout: Your Information');
        if (await checkout.stepOne.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.stepOne.getHeader().getCart().getCartBadge()).toHaveText('2');
        }
        await checkout.stepOne.fillCheckoutInfo('John', 'Doe', '12345');
        await checkout.stepOne.continue();
      });

      await test.step("Last check: checked out products names and prices and calculation and badge count", async () => {
        await expect(checkout.stepTwo.getTitleLocator()).toHaveText('Checkout: Overview');
        if (await checkout.stepTwo.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.stepTwo.getHeader().getCart().getCartBadge()).toHaveText('2');
        }
        await expect(checkout.stepTwo.cartItems).toHaveCount(2)
        await expect(productHelper.inventoryItemNames).toHaveText([
          fleeceJacketName!,
          onesieName!
        ]);
        await expect(productHelper.inventoryItemPrices).toHaveText([
          fleeceJacketPrice!,
          onesiePrice!
        ]);

        expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).name).toEqual(fleeceJacketName)
        expect((await productHelper.getProductDetails('Sauce Labs Fleece Jacket')).price).toEqual(fleeceJacketPrice)
        expect((await productHelper.getProductDetails('Sauce Labs Onesie')).name).toEqual(onesieName)
        expect((await productHelper.getProductDetails('Sauce Labs Onesie')).price).toEqual(onesiePrice)

        const subtotal = PriceUtils.parsePrice(fleeceJacketPrice) + PriceUtils.parsePrice(onesiePrice);
        const overviewSubtotal = await checkout.stepTwo.getSubtotal();
        await expect(checkout.stepTwo.subtotal).toContainText(`$${subtotal.toFixed(2)}`)
        const tax = await checkout.stepTwo.getTax()
        const total = await checkout.stepTwo.getTotal();
        const expectedTotal = subtotal + PriceUtils.parsePrice(tax);
        await expect(checkout.stepTwo.total).toContainText(`$${expectedTotal.toFixed(2)}`);
        await checkout.stepTwo.finish();
      });

      await test.step("Complete Checkout: final msg and check 0 badge count", async () => {
        await expect(checkout.complete.getTitleLocator()).toHaveText('Checkout: Complete!');
        if (await checkout.complete.getHeader().getCart().isCartBadgeVisible()) {
          await expect(checkout.complete.getHeader().getCart().getCartBadge()).toHaveText('0');
        }
        await expect(checkout.complete.completeHeader).toHaveText('Thank you for your order!')
      });
    });
  });
});

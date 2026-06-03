import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartListItems: Locator;

  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly itemQuantities: Locator;

  // Remove buttons for each product
  readonly removeBackpackButton: Locator;
  readonly removeBikeLightButton: Locator;
  readonly removeBoltShirtButton: Locator;
  readonly removeFleeceJacketButton: Locator;
  readonly removeOnesieButton: Locator;
  readonly removeTShirtButton: Locator;

  // Item details
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');

    this.cartItems = page.locator('[data-test="cart-item"]');
    this.cartListItems = page.locator('[data-test="cart-list"] [data-test="inventory-item"]');

    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.itemQuantities = page.locator('[data-test="item-quantity"]');

    // Remove buttons
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.removeBikeLightButton = page.locator('[data-test="remove-sauce-labs-bike-light"]');
    this.removeBoltShirtButton = page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]');
    this.removeFleeceJacketButton = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');
    this.removeOnesieButton = page.locator('[data-test="remove-sauce-labs-onesie"]');
    this.removeTShirtButton = page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]');

    // Item details
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  // Remove:
  getRemoveBackpackButton(): Locator {
    return this.removeBackpackButton;
  }

  getRemoveBikeLightButton(): Locator {
    return this.removeBikeLightButton;
  }

  getRemoveBoltShirtButton(): Locator {
    return this.removeBoltShirtButton;
  }

  getRemoveFleeceJacketButton(): Locator {
    return this.removeFleeceJacketButton;
  }

  getRemoveOnesieButton(): Locator {
    return this.removeOnesieButton;
  }

  getRemoveTShirtButton(): Locator {
    return this.removeTShirtButton;
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartListItems.count();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || '';
  }

  async removeItem(removeButton: Locator): Promise<void> {
    await removeButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async isCheckoutVisible(): Promise<boolean> {
    return await this.checkoutButton.isVisible();
  }

  async isContinueShoppingVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible();
  }

  async getItemNames(): Promise<string[]> {
    return await this.inventoryItemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return await this.inventoryItemPrices.allTextContents();
  }
}

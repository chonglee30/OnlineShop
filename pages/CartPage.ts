import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartListItems: Locator;

  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly itemQuantities: Locator;

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

    // Item details
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartListItems.count();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || '';
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.cart_item', { hasText: itemName });
    await itemContainer.getByRole('button', { name: 'Remove' }).click();
  }

  getRemoveButton(itemName: string): Locator {
    return this.page
      .locator('.cart_item', { hasText: itemName })
      .getByRole('button', { name: 'Remove' });
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

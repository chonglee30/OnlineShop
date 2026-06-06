import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';

export class InventoryPage extends AuthenticatedPage {
  readonly productSortContainer: Locator;

  // Inventory item elements
  readonly inventoryItems: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemNames: Locator;

  constructor(page: Page) {
    super(page)
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');

    // General inventory elements
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
  }

  async getInventoryItemPrice(itemLocator: Locator): Promise<string | null> {
    // We use the itemLocator passed in to scope the search for the price
    const priceText = await itemLocator.locator('[data-test="inventory-item-price"]').textContent();
    return priceText ? priceText.trim() : null;
  }

  getInventoryItems(): Locator {
    return this.inventoryItems;
  }

  getAddButton(itemName: string): Locator {
    return this.page
      .locator('.inventory_item', { hasText: itemName })
      .getByRole('button', { name: 'Add to cart' });
  }

  getRemoveButton(itemName: string): Locator {
    return this.page
      .locator('.inventory_item', { hasText: itemName })
      .getByRole('button', { name: 'Remove' });
  }

  // addItemToCart:
  async addItemToCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.inventory_item', { hasText: itemName });
    await itemContainer.getByRole('button', { name: 'Add to cart' }).click();
  }

  // removeItemFromCart:
  async removeItemFromCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.inventory_item', { hasText: itemName });
    await itemContainer.getByRole('button', { name: 'Remove' }).click();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.getSubTitle() === 'Products';
  }
}

import { expect, Locator, Page } from '@playwright/test';
import { ProductInfo } from '../interfaces/Product';

export class ProductHelper {
  private readonly page: Page;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  constructor(page: Page) {
    this.page = page;
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async getProductDetails(name: string): Promise<ProductInfo> {
    const container = this.page.locator('[data-test="inventory-item"]').filter({ hasText: name });
    await expect(container).toBeVisible({ timeout: 5000 });
    const nameText = await container.locator('[data-test="inventory-item-name"]').textContent();
    const descriptionText = await container.locator('[data-test="inventory-item-desc"]').textContent();
    const priceText = await container.locator('[data-test="inventory-item-price"]').textContent();
    return {
      name: nameText,
      description: descriptionText,
      price: priceText
    };
  }

  async addItemToCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('[data-test="inventory-item"]', { hasText: itemName });
    const removeButton = itemContainer.getByRole('button', { name: 'Remove' });

    // Check if it's already added to avoid redundant clicks or timeouts
    if (await removeButton.isVisible()) {
      console.log(`${itemName} is already in the cart.`);
      return;
    }
    await itemContainer.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('[data-test="inventory-item"]', { hasText: itemName });
    await itemContainer.getByRole('button', { name: 'Remove' }).click();
  }

  getAddButton(itemName: string): Locator {
    return this.page.locator('[data-test="inventory-item"]', { hasText: itemName })
      .getByRole('button', { name: 'Add to cart' });
  }

  getRemoveButton(itemName: string): Locator {
    return this.page.locator('[data-test="inventory-item"]', { hasText: itemName })
      .getByRole('button', { name: 'Remove' });
  }
}
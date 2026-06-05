import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { BurgerMenu } from './components/BurgerMenu';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly productSortContainer: Locator;
  private readonly burgerMenu: BurgerMenu;

  // Inventory item elements
  readonly inventoryItems: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemNames: Locator;

  constructor(page: Page) {
    super(page)
    this.title = page.locator('[data-test="title"]');
    this.burgerMenu = new BurgerMenu(page);
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
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

  async getCartBadgeCount(): Promise<string | null> {
    await this.shoppingCartBadge.waitFor({
      state: 'visible'
    });
    return await this.shoppingCartBadge.textContent();
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.shoppingCartBadge.isVisible();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.waitFor({
      state: 'visible'
    });
    await this.shoppingCartLink.click();
  }

  getBurgerMenu(): BurgerMenu {
    return this.burgerMenu;
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.title.isVisible();
  }
}

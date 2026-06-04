import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly productSortContainer: Locator;
  readonly burgerMenuBtn: Locator;
  readonly logoutLink: Locator;
  readonly aboutLink: Locator;

  // Inventory item elements
  readonly inventoryItems: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemNames: Locator;

  constructor(page: Page) {
    super(page)
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
    this.burgerMenuBtn = page.locator('[id="react-burger-menu-btn"]');
    this.logoutLink = page.locator('[id="logout_sidebar_link"]');
    this.aboutLink = page.locator('[id="about_sidebar_link"]');

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

  async openBurgerMenu(): Promise<void> {
    await expect(this.burgerMenuBtn).toBeVisible();
    await this.burgerMenuBtn.click({ force: true });
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.openBurgerMenu();
    await this.aboutLink.click();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.title.isVisible();
  }
}

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

  // Product add to cart buttons
  readonly addBackpackButton: Locator;
  readonly addBikeLightButton: Locator;
  readonly addBoltShirtButton: Locator;
  readonly addFleeceJacketButton: Locator;
  readonly addOnesieButton: Locator;
  readonly addTShirtButton: Locator;

  // Product remove buttons
  readonly removeBackpackButton: Locator;
  readonly removeBikeLightButton: Locator;
  readonly removeBoltShirtButton: Locator;
  readonly removeFleeceJacketButton: Locator;
  readonly removeOnesieButton: Locator;
  readonly removeTShirtButton: Locator;

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

    // Add to cart buttons
    this.addBackpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.addBikeLightButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.addBoltShirtButton = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.addFleeceJacketButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
    this.addOnesieButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
    this.addTShirtButton = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

    // Remove buttons
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.removeBikeLightButton = page.locator('[data-test="remove-sauce-labs-bike-light"]');
    this.removeBoltShirtButton = page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]');
    this.removeFleeceJacketButton = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');
    this.removeOnesieButton = page.locator('[data-test="remove-sauce-labs-onesie"]');
    this.removeTShirtButton = page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]');

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

  // Add: 
  getAddBackpackButton(): Locator {
    return this.addBackpackButton;
  }

  getAddBikeLightButton(): Locator {
    return this.addBikeLightButton;
  }

  getAddBoltShirtButton(): Locator {
    return this.addBoltShirtButton;
  }

  getAddFleeceJacketButton(): Locator {
    return this.addFleeceJacketButton;
  }

  getAddOnesieButton(): Locator {
    return this.addOnesieButton;
  }

  getAddTShirtButton(): Locator {
    return this.addTShirtButton;
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

  async addToCart(productButton: Locator): Promise<void> {
    await productButton.click();
  }

  async removeFromCart(productButton: Locator): Promise<void> {
    await productButton.click();
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

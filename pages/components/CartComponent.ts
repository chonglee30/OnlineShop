// components/CartComponent.ts
import { Locator, Page, expect } from '@playwright/test';

export class CartComponent {
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(private page: Page) {
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
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

  getCartBadge(): Locator {
    return this.shoppingCartBadge;
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible())) return 0;
    const text = await this.shoppingCartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }
}
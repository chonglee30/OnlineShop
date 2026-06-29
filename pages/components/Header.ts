
// components/Header.ts
import { Locator, Page, expect } from '@playwright/test';
import { BurgerMenu } from './BurgerMenu';
import { CartComponent } from './CartComponent';
import { Logo } from './Logo';
import { promises } from 'node:dns';

export class Header {
  private readonly burgerMenu: BurgerMenu;
  private readonly cart: CartComponent;
  private readonly logo: Logo;

  constructor(private page: Page) {
    this.burgerMenu = new BurgerMenu(this.page);
    this.cart = new CartComponent(this.page);
    this.logo = new Logo(page.locator('.app_logo'));
  }

  // Traditional wrapper methods
  getBurgerMenu(): BurgerMenu {
    return this.burgerMenu;
  }

  getCart(): CartComponent {
    return this.cart;
  }

  getLogo(): Logo {
    return this.logo;
  }

  async verifyMenu(): Promise<void>  {
    await expect(this.burgerMenu.menuContainer).toMatchAriaSnapshot(`
      - button "Open Menu"
      `);
  }
}

// - navigation:
      //     - link "All Items":
      //         - /url: "#"
      //     - link "About":
      //         - /url: https://saucelabs.com/
      //     - link "Logout":
      //         - /url: "#"
      //     - link "Reset App State":
      //         - /url: "#"
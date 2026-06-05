
// components/Header.ts
import { Locator, Page, expect } from '@playwright/test';
import { BurgerMenu } from './BurgerMenu';
import { CartComponent } from './CartComponent';
import { Logo } from './Logo';

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
}
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AuthenticatedPage } from './AuthenticatedPage';
import { BurgerMenu } from './components/BurgerMenu';

export class CartPage extends AuthenticatedPage {
  readonly cartItems: Locator;
  readonly cartListItems: Locator;

  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly itemQuantities: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.cartListItems = page.locator('[data-test="cart-list"] [data-test="inventory-item"]');

    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
  }

  getCartItems() {
    return this.cartListItems
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartListItems.count();
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
}

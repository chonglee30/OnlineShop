// manager/PageManager.ts
import { Page, expect } from "@playwright/test";
import { LoginPage } from '../LoginPage';
import { InventoryPage } from '../InventoryPage';
import { CartPage } from '../CartPage';
import { CheckoutManager } from './CheckoutManager';

export class ManagerPage {
  private readonly page: Page
  private readonly loginPage: LoginPage
  private readonly inventoryPage: InventoryPage
  private readonly cartPage: CartPage
  private readonly checkoutManager: CheckoutManager;

  constructor(page: Page) {
    this.page = page
    this.loginPage = new LoginPage(this.page)
    this.inventoryPage = new InventoryPage(this.page)
    this.cartPage = new CartPage(this.page)
    this.checkoutManager = new CheckoutManager(this.page);
  }

  onLoginPage() { //: LoginPage
    return this.loginPage
  }

  onInventoryPage() { //: InventoryPage
    return this.inventoryPage
  }

  onCartPage() { //: CartPage
    return this.cartPage
  }

  onCheckout() {
    return this.checkoutManager;
  }
}
// manager/PageManager.ts
import { Page, expect } from "@playwright/test";
import { LoginPage } from '../LoginPage';
import { InventoryPage } from '../InventoryPage';
import { CartPage } from '../CartPage';
import { CheckoutManager } from './CheckoutManager';
import { ProductHelper } from "../../utils/ProductHelper";

export class ManagerPage {
  private readonly page: Page
  private readonly loginPage: LoginPage
  private readonly inventoryPage: InventoryPage
  private readonly cartPage: CartPage
  private readonly checkoutManager: CheckoutManager;
  private productHelper: ProductHelper;

  constructor(page: Page) {
    this.page = page
    this.loginPage = new LoginPage(this.page)
    this.inventoryPage = new InventoryPage(this.page)
    this.cartPage = new CartPage(this.page)
    this.checkoutManager = new CheckoutManager(this.page);
    this.productHelper = new ProductHelper(this.page);
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

  getProductHelper() : ProductHelper {
    return this.productHelper;
  }
}
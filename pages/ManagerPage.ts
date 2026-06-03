import { Page, expect } from "@playwright/test";
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export class ManagerPage {

private readonly page:Page 
  private readonly loginPage: LoginPage
  private readonly inventoryPage: InventoryPage
  private readonly cartPage: CartPage 
  private readonly checkoutPage: CheckoutPage
   
  constructor(page: Page) {
    this.page = page 
    this.loginPage = new LoginPage(this.page)
    this.inventoryPage = new InventoryPage(this.page)
    this.cartPage = new CartPage(this.page)
    this.checkoutPage = new CheckoutPage(this.page)
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

  onCheckoutPage() { //: CheckoutPage
    return this.checkoutPage
  }
}
// components/BurgerMenu.ts
import { Locator, Page, expect } from '@playwright/test';

export class BurgerMenu {
  private readonly page: Page;
  readonly menuBtn: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuBtn = page.locator('#react-burger-menu-btn');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async open(): Promise<void> {
    await expect(this.menuBtn).toBeVisible();
    await this.menuBtn.click();
    // Ensure the menu items are visible after clicking
    await expect(this.logoutLink).toBeEnabled();
    // If you need to ensure the menu is fully expanded, 
    // verify the 'aria-hidden' attribute which often toggles in UI libraries:
    await expect(this.page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false');
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async clickAbout(): Promise<void> {
    await this.open();
    await this.aboutLink.click();
  }
  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }
}
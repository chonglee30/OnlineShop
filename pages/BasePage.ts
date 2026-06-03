import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page 

  constructor(page: Page) {
    this.page = page
  }

  async waitForURL(url: string) {
     await this.page.waitForURL(url);
  }

  async waitForSeconds( seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async setStorageState(authFile: string) {
    await this.page.context().storageState({ path: authFile })
  }
} 
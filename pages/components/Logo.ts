// components/Logo.ts
import { Locator } from '@playwright/test';
export class Logo {
  constructor(private locator: Locator) { }
  async getText(): Promise<string | null> { return await this.locator.textContent(); }
  getLocator(): Locator {
    return this.locator;
  }
}
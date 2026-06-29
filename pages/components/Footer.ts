import { expect, Locator, Page } from "@playwright/test";
import { SOCIAL_LINKS } from '../../constants/socialLinks'

export class Footer {
  readonly footerContainer: Locator;
  readonly copyrightText: Locator;

  constructor(private readonly page: Page) {
    this.footerContainer = page.locator('[data-test="footer"]')
    this.copyrightText = page.locator('[data-test="footer-copy"]');
  }

  // Helper to get a locator link by name dynamically
  private getLink(name: string): Locator {
    return this.page.getByRole('link', { name: name });
  }

  async openSocialLink(name: string) {
    const linkInfo = SOCIAL_LINKS.find(link => link.name === name);
    if (!linkInfo) throw new Error(`Link ${name} is not found in the social constants`);
    return await this.openAndCheckNewPage(name, linkInfo.expectedUrl);
  }

  async openAndCheckNewPage(linkName: string, expectedUrl: RegExp) {
    const context = this.page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      this.page.getByRole('link', { name: linkName }).click()
    ]);
    await newPage.waitForLoadState('load');
    await expect(newPage).toHaveURL(expectedUrl);
    return newPage;
  }

  async scrollToFooter(): Promise<void> {
    await this.footerContainer.scrollIntoViewIfNeeded();
  }

  async getCopyright(): Promise<Locator | null> {
    return await this.copyrightText;
  }

  async expectCurrentYear(): Promise<void> {
    const currentYear = new Date().getFullYear().toString();
    await this.scrollToFooter()
    await expect(this.copyrightText).toContainText(currentYear);
  }  
}
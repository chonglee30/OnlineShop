import {test as base } from '@playwright/test'
import { ManagerPage } from './pages/manager/ManagerPage';
import { config } from './user.config';

export type TestOptions = {
  managerPage: ManagerPage
  config: typeof config
}

export const test = base.extend<TestOptions>({
  managerPage: async ({ page }, use) => {
    const managerPage = new ManagerPage(page);
    await managerPage.onLoginPage().goToLoginPage(config.url);
    await use(managerPage);
  },
  config: async ({}, use) => {
    await use(config);
  }
}); 
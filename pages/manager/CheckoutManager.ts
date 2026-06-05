import { Page, Locator } from '@playwright/test';
import { StepOnePage } from '../checkout/StepOnePage';
import { StepTwoPage } from '../checkout/StepTwoPage';
import { CompletePage } from '../checkout/CompletePage';

// manager/CheckoutManager.ts
export class CheckoutManager {
  readonly stepOne!: StepOnePage;
  readonly stepTwo!: StepTwoPage;
  readonly complete!: CompletePage;

  constructor(private page: Page) {
    this.stepOne = new StepOnePage(this.page);
    this.stepTwo = new StepTwoPage(this.page);
    this.complete = new CompletePage(this.page);
  }
}
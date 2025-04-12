import { expect, Locator, Page } from '@playwright/test';
import { step } from '@utils/decorators';

export default abstract class BasePage {
  public constructor(protected readonly page: Page) {
    this.page = page;
  }

  protected abstract get pageUrl(): string;

  @step('Open page.')
  public async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
  }

  @step('Close page.')
  public async closePage(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.close();
  }

  @step('Verify element "${element}" count is ${expectedCount}.')
  public async assertElemetCount(element: Locator, expectedCount: number): Promise<void> {
    await expect(element).toHaveCount(expectedCount);
  }

  @step('Verify element "${element}" visibility is ${isVisible}.')
  public async assertElementVisibility(element: Locator, isVisible: boolean): Promise<void> {
    await expect(element).toBeVisible({ visible: isVisible });
  }
}

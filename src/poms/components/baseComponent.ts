import { Locator } from '@playwright/test';

export default abstract class BaseComponent {
  public constructor(protected readonly container: Locator) {
  }
}

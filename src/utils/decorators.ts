import { replacePlaceholders } from '@helpers/helpers';
import BasePage from '@pages/basePage';
import { test } from '@playwright/test';

export function step(stepName?: string) {
  return function<This extends BasePage, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return> | Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return> | Return>,
  ) {
    return function(this: This, ...args: Args) {
      const name = stepName
        ? `${replacePlaceholders(stepName, /\${(.*?)}/, args)}`
        : `${this.constructor.name + '.' + (context.name as string)}`;
      return test.step(name, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}

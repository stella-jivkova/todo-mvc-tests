# todo-mvc-tests

This is a basic Playwright and Typescript project covering main test scenarios for https://demo.playwright.dev/todomvc.

## Table of contents

 1. [Description](#description)
 2. [Setup](#setup)
 3. [Running tests](#running-tests)
 
## Description

The project is based on standard Page-Object Model.
For every web-page a separate class is created, encapsulating all web-elements the tests are interacting with and all user actions performed on the page.  
The project is using a ```BasePage``` class to define common actions for all pages.

This model can be easily extended with component classes representing web-components which are re-used in multiple pages, but the current scope of the task did not require such implementation.

### Basic concept

In order to create a new page class extend ```BasePage``` and provide ```pageUrl()``` implementation, as well as element definitions and relevan actions functions.   
Example:
```
import BasePage from '@pages/basePage';
import { expect, Locator } from '@playwright/test';
import { step } from '@utils/decorators';

export default class SearchPage extends BasePage {
  public get pageUrl(): string {
    return '/example-url';
  }

  public get searchTextbox(): Locator {
    return this.page.getByPlaceholder('Search');
  }

  public get submitButton(): Locator {
    return this.page.locator('#submit-button');
  }
  
  public get resultsSection(): Locator {
      return this.page.getByTestId('results-section');
  }

  @step('Perform search for "${item}".')
  public async searchFor(item: string): Promise<void> {
    await this.searchTextbox.fill(item);
    await this.submitButton.click;
  }
}

```

An instance of this new class can be then used in a test, giving access to both `SearchPage` and `BasePage` properties and methods:
```
test('should be able to search for items', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigate();
    await searchPage.searchFor('playwright');
    
    test.step('Verify search results', async () => {
        await expect(searchPage.resultsSection).toContainText('Playwright');
    })
});
```

### Playwright steps

This project is utilising Playwright's ```test.step``` in order to improve reports readbility. In the examples above you can see the two ways it can be used in.  
* Inside a test to describe a certain action or sequence of actions - ```test.step('Step name', async () => { ... })```
* As a decorator for class methods ```@step('Step name')``` or ```@step()```.

### Fixtures
Fixtures are used for setting up a specific page state before each test. This acn be applied to the example above by creating a new search page fixture:
```
import SearchPage from '@pages/searchPage';
import { test as base } from '@playwright/test';

type searchFixtures = {
  searchPage: SearchPage;
};

export const test = base.extend<searchFixtures>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);

    await searchPage.navigate();
    await use(searchPage);
  },
});
```

With this the example test above can be written like:
```
import { test } from '@fixtures/searchPageFixtures';

test('should be able to search for items', async ({ searchPage }) => {
    await searchPage.searchFor('playwright');
    test.step('Verify search results', async () => {
        await expect(searchPage.resultsSection).toContainText('Playwright');
    })
});
```

## Setup

1. Install latest version of Node.js 20 or 22. Follow instructions here - https://nodejs.org/en/download
2. Clone the todo-mvc-tests repository.

   ```bash
   git clone https://github.com/stella-jivkova/todo-mvc-tests
   ```
3. Install

   ```bash
   npm install
   ```

## Running tests

   ```bash
   npm run test
   # runs all tests with all three browsers
   
   npm run test:chromium
   # runs all tests with chromium only
   
   npm run test:ui
   # opens tests in Playwright UI mode
   ```

### Reporting

To view HTML report after a successful test execution run:
``` 
npx playwright show-report
```

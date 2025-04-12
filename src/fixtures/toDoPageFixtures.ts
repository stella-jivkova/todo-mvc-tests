import ToDoMvcPage from '@pages/toDoMvcPage';
import { test as base } from '@playwright/test';
import { DefaultItemsEnum } from '@resources/defaultItemsEnum';

type ToDoFixtures = {
  toDoPage: ToDoMvcPage;
  toDoPageWithListItems: ToDoMvcPage;
};

export const test = base.extend<ToDoFixtures>({
  toDoPage: async ({ page }, use) => {
    const toDoPage = new ToDoMvcPage(page);

    await toDoPage.navigate();
    await use(toDoPage);
  },

  toDoPageWithListItems: async ({ toDoPage }, use) => {
    for (const item of Object.values(DefaultItemsEnum)) {
      await toDoPage.createToDoItem(item);
    }
    await use(toDoPage);
  },
});

import { test } from '@fixtures/toDoPageFixtures';
import { DefaultItemsEnum } from '@resources/defaultItemsEnum';
import { FilterValuesEnum } from '@resources/filterEnum';

test.describe('To Do Mvc Tests', () => {
  test('Add new todo item and verify it appears in the list', async ({ toDoPage }) => {
    await toDoPage.createToDoItem(DefaultItemsEnum.TO_DO_1);
    await toDoPage.assertNumberOfItemsInList(1);

    const createdItemLocator = toDoPage.getItemLocatorByText(DefaultItemsEnum.TO_DO_1);
    await toDoPage.assertElemetCount(createdItemLocator, 1);
    await toDoPage.assertElementVisibility(createdItemLocator, true);
  });

  test('Mark a todo item as completed and verify its status', async ({ toDoPageWithListItems }) => {
    await toDoPageWithListItems.completeToDoItem(DefaultItemsEnum.TO_DO_2);
    await toDoPageWithListItems.assertItemIsChecked(DefaultItemsEnum.TO_DO_2, true);
    await toDoPageWithListItems.assertItemIsChecked(DefaultItemsEnum.TO_DO_1, false);
    await toDoPageWithListItems.assertItemIsChecked(DefaultItemsEnum.TO_DO_3, false);
  });

  test('Delete a todo item and verify it no longer appears.', async ({ toDoPageWithListItems }) => {
    await toDoPageWithListItems.deleteToDoItem(DefaultItemsEnum.TO_DO_3);
    await toDoPageWithListItems.assertElemetCount(
      toDoPageWithListItems.getItemLocatorByText(DefaultItemsEnum.TO_DO_3),
      0,
    );
  });

  test('Verify that the counter updates correctly after actions', async ({ toDoPage }) => {
    await test.step('Add first to do item and verify counter', async () => {
      await toDoPage.createToDoItem(DefaultItemsEnum.TO_DO_1);
      await toDoPage.assertNumberOfItemsInList(1);
      await toDoPage.assertItemsCounterValue(1);
    });

    await test.step('Add second to do item and verify counter', async () => {
      await toDoPage.createToDoItem(DefaultItemsEnum.TO_DO_2);
      await toDoPage.assertItemsCounterValue(2);
    });

    await test.step('Complete one to do item and verify counter', async () => {
      await toDoPage.completeToDoItem(DefaultItemsEnum.TO_DO_1);
      await toDoPage.assertItemsCounterValue(1);
    });

    await test.step('Delete remaining to do item and verify counter', async () => {
      await toDoPage.deleteToDoItem(DefaultItemsEnum.TO_DO_2);
      await toDoPage.assertItemsCounterValue(0);
    });

    await test.step('Uncheck completed to do item and verify counter', async () => {
      await toDoPage.uncheckCompletedItem(DefaultItemsEnum.TO_DO_1);
      await toDoPage.assertItemsCounterValue(1);
    });
  });

  test('Test filtering functionality: All / Active / Completed.', async ({ toDoPageWithListItems }) => {
    const itemOneLocator = toDoPageWithListItems.getItemLocatorByText(DefaultItemsEnum.TO_DO_1);
    const itemTwoLocator = toDoPageWithListItems.getItemLocatorByText(DefaultItemsEnum.TO_DO_2);
    const itemThreeLocator = toDoPageWithListItems.getItemLocatorByText(DefaultItemsEnum.TO_DO_3);

    await toDoPageWithListItems.completeToDoItem(DefaultItemsEnum.TO_DO_2);

    await toDoPageWithListItems.filterItems(FilterValuesEnum.COMPLETED);
    await toDoPageWithListItems.assertNumberOfItemsInList(1);
    await toDoPageWithListItems.assertElementVisibility(itemTwoLocator, true);

    await toDoPageWithListItems.filterItems(FilterValuesEnum.ACTIVE);
    await toDoPageWithListItems.assertNumberOfItemsInList(2);
    await toDoPageWithListItems.assertElementVisibility(itemOneLocator, true);
    await toDoPageWithListItems.assertElementVisibility(itemThreeLocator, true);

    await toDoPageWithListItems.filterItems(FilterValuesEnum.ALL);
    await toDoPageWithListItems.assertNumberOfItemsInList(3);
    await toDoPageWithListItems.assertElementVisibility(itemOneLocator, true);
    await toDoPageWithListItems.assertElementVisibility(itemTwoLocator, true);
    await toDoPageWithListItems.assertElementVisibility(itemThreeLocator, true);
  });
});

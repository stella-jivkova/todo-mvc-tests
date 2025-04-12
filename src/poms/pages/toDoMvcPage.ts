import BasePage from '@pages/basePage';
import { expect, Locator } from '@playwright/test';
import { FilterValuesEnum } from '@resources/filterEnum';
import { step } from '@utils/decorators';

export default class ToDoMvcPage extends BasePage {
  public get pageUrl(): string {
    return '/todomvc';
  }

  public get newToDoInput(): Locator {
    return this.page.getByPlaceholder('What needs to be done?');
  }

  public get toDoList(): Locator {
    return this.page.locator('.todo-list');
  }

  public get listItem(): Locator {
    return this.toDoList.getByTestId('todo-item');
  }

  public get itemsCounter(): Locator {
    return this.page.getByTestId('todo-count');
  }

  public getItemLocatorByText(itemText: string): Locator {
    return this.listItem.filter({ hasText: itemText });
  }

  @step('Create new to do item with text "${item}".')
  public async createToDoItem(item: string): Promise<void> {
    await this.newToDoInput.fill(item);
    await this.newToDoInput.press('Enter');
  }

  @step('Get the number of items present in the list.')
  public async getNumberOfListItems(): Promise<number> {
    return await this.listItem.count();
  }

  @step('Get item counter current value.')
  public async getCounterNumber(): Promise<number> {
    const counterText = await this.itemsCounter.textContent() || '';
    const counterNumber = parseInt(counterText.replace(/[^0-9]/g, ''));
    expect(counterNumber, 'item counter did not contain a number').not.toBe(NaN);
    return counterNumber;
  }

  @step('Mark to do item as completed.')
  public async completeToDoItem(item: string | Locator): Promise<void> {
    if (typeof item === 'string') {
      item = this.getItemLocatorByText(item).getByRole('checkbox');
    }
    await item.check();
  }

  @step('Uncheck completed to do item.')
  public async uncheckCompletedItem(item: string | Locator): Promise<void> {
    if (typeof item === 'string') {
      item = this.getItemLocatorByText(item).getByRole('checkbox');
    }
    if (await item.isChecked()) {
      await item.uncheck();
    }
  }

  @step('Delete item from list.')
  public async deleteToDoItem(item: string | Locator): Promise<void> {
    if (typeof item === 'string') {
      item = this.getItemLocatorByText(item);
    }
    await item.hover();
    await item.getByLabel('Delete').click();
  }

  @step('Filter list items by criteria: ${filter}.')
  public async filterItems(filter: FilterValuesEnum): Promise<void> {
    await this.page.getByRole('link', { name: filter }).click();
  }

  @step('Verify to do list contains ${expectedNumber} to do items.')
  public async assertNumberOfItemsInList(expectedNumber: number): Promise<void> {
    expect(await this.getNumberOfListItems()).toEqual(expectedNumber);
  }

  @step('Verify if item "${item}" is checked. Expected "${isChecked}')
  public async assertItemIsChecked(item: string, isChecked: boolean): Promise<void> {
    await expect(this.getItemLocatorByText(item).getByRole('checkbox')).toBeChecked({ checked: isChecked });
  }

  @step('Verify counter has value ${expectedValue}')
  public async assertItemsCounterValue(expectedValue: number): Promise<void> {
    expect(await this.getCounterNumber()).toEqual(expectedValue);
  }
}

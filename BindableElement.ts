
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

export class BindableElement<ItemType> extends LitElement{
    // Data to be rendered
  @property({type: Array})
  items:Array<ItemType>;

  // Function to convert data to list items
  itemToListItem: (item: ItemType) => TemplateResult<1>;

  constructor(items: Array<ItemType>, itemToListItem: (item: ItemType) => TemplateResult<1>) {
    super();

    this.items = items;
    this.itemToListItem = itemToListItem;
  }

  protected override render() { 
    return this.items.reduce<TemplateResult<1>>((template, item) => {
      return {
        ['_$litType$']: 1,
        strings: [...template.strings, ...this.itemToListItem(item).strings] as unknown as TemplateStringsArray,
        values: template.values.concat(this.itemToListItem(item).values)
      }
    }, html``);
}
}
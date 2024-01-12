
import {LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

export class BindableCollectionElement<ItemType> extends LitElement{
    // Data to be rendered
  @property({type: Array})
  data:Array<ItemType>;

  // Function to convert data to list items
  itemToListItem: (item: ItemType) => TemplateResult<1>;

  constructor(data: Array<ItemType>, itemToListItem: (item: ItemType) => TemplateResult<1>) {
    super();

    this.data = data;
    this.itemToListItem = itemToListItem;
  }

}
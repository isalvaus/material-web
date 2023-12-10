/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement} from 'lit';
import {property,queryAssignedElements} from 'lit/decorators.js';

import {ListController, NavigableKeys} from './list-controller.js';
import {ListItem as SharedListItem} from './list-navigation-helpers.js';
import { Item } from '@material/web/labs/item/internal/item.js';

const NAVIGABLE_KEY_SET = new Set<string>(Object.values(NavigableKeys));

interface ListItem extends SharedListItem {
  type: 'text' | 'button' | 'link';
}

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class List<ItemType> extends LitElement {
  /**
   * An array of activatable and disableable list items. Queries every assigned
   * element that has the `md-list-item` attribute.
   *
   * _NOTE:_ This is a shallow, flattened query via
   * `HTMLSlotElement.queryAssignedElements` and thus will _only_ include direct
   * children / directly slotted elements.
   */
  @queryAssignedElements({flatten: true})
  protected slotItems!: Array<ListItem | (HTMLElement & {item?: ListItem})>;

  // Data to be rendered
  @property({type: Array})
  data:Array<ItemType>;

  // Function to convert data to list items
  itemToListItem: (item: ItemType) => ListItem;

  /** @export */
  get items() {
    return this.listController.items;
  }

  private readonly listController = new ListController<ListItem>({
    isItem: (item: HTMLElement): item is ListItem =>
      item.hasAttribute('md-list-item'),
    getPossibleItems: () => this.slotItems,
    isRtl: () => getComputedStyle(this).direction === 'rtl',
    deactivateItem: (item) => {
      item.tabIndex = -1;
    },
    activateItem: (item) => {
      item.tabIndex = 0;
    },
    isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
    isActivatable: (item) => !item.disabled && item.type !== 'text',
  });

  private readonly internals =
    // Cast needed for closure
    (this as HTMLElement).attachInternals();

  constructor(data: Array<ItemType>,  itemToListItem: (item: ItemType) => ListItem) {
    super();

    this.data = data;
    this.itemToListItem = itemToListItem;

    if (!isServer) {
      this.internals.role = 'list';
      this.addEventListener('keydown', this.listController.handleKeydown);
    }
  }


  protected override render() {
    return html`
      ${this.data.map((item) => this.itemToListItem(item))}
    `;
  }

  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem(): ListItem | null {
    return this.listController.activateNextItem();
  }

  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem(): ListItem | null {
    return this.listController.activatePreviousItem();
  }
}

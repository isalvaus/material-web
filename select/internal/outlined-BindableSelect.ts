/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {BindableSelect} from './BindableSelect.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class OutlinedBindableSelect<ItemType> extends BindableSelect<ItemType> {
  protected readonly fieldTag = literal`md-outlined-field`;
}

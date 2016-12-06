/*
 * These are globally available directives in any template
 */

import { PLATFORM_DIRECTIVES } from '@angular/core';
// Angular 2 Router
import { ROUTER_DIRECTIVES } from '@angular/router';


import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {  MODAL_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';


// Angular 2 Material 2
// TODO(gdi2290): replace with @angular2-material/all
// import { MATERIAL_DIRECTIVES } from './angular2-material2';

// import { ColumnsComponent, ColumnComponent, DirectiveGrow } from '../../app/shared';

// application_directives: directives that are global through out the application
export const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES,
  ...FORM_DIRECTIVES,
  ...REACTIVE_FORM_DIRECTIVES,
  ...MODAL_DIRECTIVES,
  // ...[ColumnComponent, ColumnsComponent, DirectiveGrow]
];

export const DIRECTIVES = [
  { provide: PLATFORM_DIRECTIVES, multi: true, useValue: APPLICATION_DIRECTIVES }
];

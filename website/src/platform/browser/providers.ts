/*
 * These are globally available services in any component or any other service
 */
import {provide} from '@angular/core';

// Angular 2
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { disableDeprecatedForms, provideForms, FORM_PROVIDERS } from '@angular/forms';

// Angular 2 Http
import { HTTP_PROVIDERS, Http, JSONP_PROVIDERS } from '@angular/http';
// Angular 2 Router
import { provideRouter } from '@angular/router';

// Angular 2 Material
// TODO(gdi2290): replace with @angular2-material/all
// import { MATERIAL_PROVIDERS } from './angular2-material2';

import {TRANSLATE_PROVIDERS, TranslateLoader, TranslateStaticLoader}
from 'ng2-translate/ng2-translate';

import { NG2REST_PROVIDERS } from 'ng2-rest/ng2-rest';

import { routes, asyncRoutes, prefetchRouteCallbacks
} from '../../app/app.routes';
import { provideWebpack } from '@angularclass/webpack-toolkit';
import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';

// import { LoginService } from '../../app/start-page/login/model';
// import { SearchService } from '../../app/+dashboard/topbar/search';
// import { TasksService } from '../../app/+dashboard/content/content-tasks/model';


/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  disableDeprecatedForms(),
  provideForms(),

  ...HTTP_PROVIDERS,
  // ...MATERIAL_PROVIDERS,
  ...TRANSLATE_PROVIDERS,

  provideRouter(routes),
  provideWebpack(asyncRoutes),
  providePrefetchIdleCallbacks(prefetchRouteCallbacks),

  { provide: LocationStrategy, useClass: HashLocationStrategy },
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  })
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS,
  ...NG2REST_PROVIDERS,
  ...FORM_PROVIDERS,
    // LoginService,
    // TasksService,
    // SearchService
];

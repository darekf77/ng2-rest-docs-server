import {StartPageComponent} from './start-page';
import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
// import { NoContent } from './shared/no-content';
import { RouterConfig, Router } from '@angular/router';

export let routes: RouterConfig = [
    { path: '', component: StartPageComponent },
    { path: 'login', component: StartPageComponent },
    // { path: '**', component: NoContent }
];



export const asyncRoutes: AsyncRoutes = {
    // we have to use the alternative syntax for es6-promise-loader to grab the routes
    // 'Detail': require('es6-promise-loader!./+detail'),
    // 'Index': require('es6-promise-loader!./+detail'), // must be exported with detail/index.ts
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
    // asyncRoutes['Detail'],
    // es6-promise-loader returns a function
];


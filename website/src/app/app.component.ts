/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewContainerRef, Inject } from '@angular/core';


import { HighlightCodeDirective } from './start-page/highlight.directive';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { Resource } from 'ng2-rest/ng2-rest';

import { AppState } from './app.service';
import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('app component');


export enum ENDPOINTS {
  API
}

require('!style!css!bootstrap/dist/css/bootstrap.css');
require('!style!css!font-awesome/css/font-awesome.css');
require('!style!css!assets/lib/vs.css');

require('!script-loader!assets/lib/highlight.js');
require('!script-loader!assets/lib/groovy.js');



/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [],
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('!raw!normalize.css'),
    require('!raw!../assets/css/animate.css'),
    require('./app.component.scss')
  ],
  template: require('./app.component.html'),
  directives: [HighlightCodeDirective]
})
export class App {
  angularclassLogo = ''; //assets/img/angularclass-avatar.png';
  loading = false;
  name = 'Company CRM';
  url = 'https://github.com/darekf77/ng2-rest-docs-server';

  private viewContainerRef: ViewContainerRef;

  constructor(
    private translate: TranslateService,
    public appState: AppState,
    viewContainerRef:ViewContainerRef
  ) {
     this.viewContainerRef = viewContainerRef;
    // Log.setProductionMode();
    Resource.map(ENDPOINTS.API.toString(), 'http://localhost:3002/api');
    let userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'pl';

    // this language will be used as a fallback when a translation
    // isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('pl');

  }

  ngOnInit() {
    log.d('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */

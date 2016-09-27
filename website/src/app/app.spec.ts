import {
    beforeEachProviders,
    inject,
    it,
} from '@angular/core/testing';

// import {MockApplicationRef} from '@angular/testing';
import { RouteMock, ActivatedRouteMock } from './shared/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { AppState } from './app.service';

import {provide, ApplicationRef } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {Http, HTTP_PROVIDERS, XHRBackend, BaseRequestOptions} from '@angular/http';
import { Router, provideRouter } from '@angular/router';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {addProviders } from '@angular/core/testing';

import {TranslateService, TRANSLATE_PROVIDERS, TranslateLoader, TranslateStaticLoader}
from 'ng2-translate/ng2-translate';
import { Resource } from 'ng2-rest/ng2-rest';

import { SpecsShared } from './shared/shared.spec';
import { SpecsStartPage } from './start-page/start-page.spec';
import { SpecsDashboard } from './+dashboard/dashboard.spec';


let activatedRouteMock = new ActivatedRouteMock();
let routeMock = new RouteMock();

describe('App', () => {

    Resource.setProductionMode();
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {

        addProviders([
            AppState,
            App,
            Http, HTTP_PROVIDERS,
            TranslateService, TRANSLATE_PROVIDERS,
            MockBackend,
            BaseRequestOptions,
            provide(XHRBackend, { useClass: MockBackend }),
            provide(TranslateLoader, {
                useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
                deps: [Http]
            }),
            routeMock.getProvide(),
            activatedRouteMock.setParams({}).getProvide(),
            provide(APP_BASE_HREF, { useValue: '/' }),
            // provide(ApplicationRef, {useClass: MockApplicationRef})
        ]);
    });

    it('should have a url', inject([App], (app) => {
        expect(app.url).toEqual('https://eniro.com');
    }));

    SpecsShared();
    SpecsStartPage();
    SpecsDashboard();

});

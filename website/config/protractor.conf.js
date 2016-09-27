/**
 * @author: @AngularClass
 */

var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

require('ts-node/register');
var helpers = require('./helpers');

exports.config = {
  baseUrl: 'http://localhost:3000',

  params: {
    baseUrl: 'http://localhost:3000'
  },

  // use `npm run e2e`
  specs: [
    helpers.root('features/files/*.feature')
  ],
  exclude: [],

  framework: 'custom',

  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    format: "summary",
    resultJsonOutputFile: 'report.json',
    require: [
      "features/support/*.ts",
      "features/step_definitions/**/*.po.ts",
      "features/step_definitions/**/*.e2e.ts"
    ],
    tags: ['@dev']
  },

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        'show-fps-counter=true',
        '--disable-web-security'        
      ]
      // 'chromeOptions': {
      //   'args': ['incognito', 'disable-extensions', 'start-maximized', 'enable-crash-reporter-for-testing']
      // },
    },
    'loggingPrefs': {
        'browser': 'ALL'
    }
  },

  onPrepare: function () {
    browser.ignoreSynchronization = true;
    // global.dvr = browser.driver;
  //   global.isAngularSite = function(flag) {
  //     browser.ignoreSynchronization = !flag;
  //  };
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
  useAllAngular2AppRoots: true
};

// App
export * from './app.component';
export * from './app.service';

// import { LoginService } from './start-page/login';
import { AppState } from './app.service';
import { Resource } from 'ng2-rest/ng2-rest';

// Application wide providers
export const APP_PROVIDERS = [
  AppState
  // LoginService
  // Resource
];

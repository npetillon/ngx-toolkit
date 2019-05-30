import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {CookieFactory, CookieService} from './cookie.service';
import {CookieOptions} from './cookie.model';
import {COOKIE_DECORATOR_DATA} from './cookie.decorator';
import {COOKIE_OPTIONS} from './cookie.token';
import {BrowserCookieFactory} from './browser/index';

export function setupCookieDecorator(cookieService: CookieService) {
  COOKIE_DECORATOR_DATA.cookieService = cookieService;
  return () => null;
}

export function newCookieFactory(document: any) {
  return new BrowserCookieFactory(document);
}

@NgModule()
export class CookieModule {
  /**
   * In root module to provide the CookieService & CookieOptions
   */
  static forRoot(cookieOptions?: CookieOptions): ModuleWithProviders {
    return {
      ngModule: CookieModule,
      providers: [
        {
          provide: COOKIE_OPTIONS,
          useValue: cookieOptions
        },
        {
          provide: CookieFactory,
          useFactory: newCookieFactory,
          deps: [DOCUMENT]
        },
        CookieService,
        {
          provide: APP_INITIALIZER,
          useFactory: setupCookieDecorator,
          deps: [CookieService],
          multi: true
        }
      ]
    };
  }
}

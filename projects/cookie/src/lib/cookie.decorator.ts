import {CookieOptions} from './cookie.model';
import {CookieService} from './cookie.service';

export interface CookieDecoratorData {
  cookieService?: CookieService;
}

export const COOKIE_DECORATOR_DATA: CookieDecoratorData = {};

/**
 * Property Decorator to Get / Set cookie
 */
export function Cookie(name?: string, options?: CookieOptions): PropertyDecorator {
  return function(target: any, key: string) {
    let _value: any;

    if (delete target[key]) {
      const cookieName: string = name || key;

      Object.defineProperty(target, key, {
        get: function() {
          if (COOKIE_DECORATOR_DATA.cookieService) {
            const cookieValue: string = COOKIE_DECORATOR_DATA.cookieService.getItem(cookieName);
            try {
              return JSON.parse(cookieValue);
            } catch (e) {
              return cookieValue;
            }
          } else {
            return _value;
          }
        },
        set: function(value) {
          if (COOKIE_DECORATOR_DATA.cookieService) {
            COOKIE_DECORATOR_DATA.cookieService.setItem(
              cookieName,
              typeof value === 'string' ? value : JSON.stringify(value),
              options
            );
          } else {
            _value = value;
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

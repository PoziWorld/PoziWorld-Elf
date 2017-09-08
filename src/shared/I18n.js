import i18next from 'i18next';
import Backend from 'i18next-sync-fs-backend';

import config from './config';

/** Class used for localization */

export default class I18n {

  /**
   * Synchronously initialize localization module.
   *
   * @param {string[]} arrNamespaces - Array of file names (without extension) of the translation resources.
   */

  constructor( arrNamespaces ) {
    const strNodeEnv = process.env.NODE_ENV;
    let strLoadPath = typeof strNodeEnv === 'string' && strNodeEnv.trim() === 'development'
      ? '.'
      : './resources/app.asar'
      ;

    strLoadPath += '/src/locales/{{lng}}/{{ns}}.json';

    this.i18n =
      i18next
        .use( Backend )
        .init(
          {
            lng: 'en-US',
            debug: config.get( 'boolIsDebugModeOn' ) === true,
            fallbackLng: { 'default': [ 'en-US' ] },
            load: 'currentOnly',
            ns: arrNamespaces,
            defaultNS: arrNamespaces,
            backend: {
              loadPath: strLoadPath
            },
            initImmediate: false
          },
          ( err, t ) => {
            if ( err ) {
              throw err;
            }
          }
        );
  }

  /**
   *
   */

  getInstance() {
    return this.i18n;
  }

  /**
   * The translation function.
   * http://i18next.com/docs/api/#t
   *
   * @param {string} strKey - Key from JSON file.
   * @param {Object} [objOptions] - http://i18next.com/docs/options/#t-options
   * @returns {string}
   */

  t( strKey, objOptions ) {
    return this.i18n.t( strKey, objOptions );
  }
}

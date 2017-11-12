import config from '../shared/config';

export const windows = {
  intro: {
    instance: null,
    options: {
      width: 777,
      height: 500,
      alwaysOnTop: false,
      darkTheme: config.get( 'boolUseDarkTheme' ),
    },
    fileName: 'intro',
    isOpen: false,
  },
  index: {
    instance: null,
    options: {
      width: 300,
      height: 300,
      autoHideMenuBar: config.get( 'boolAutoHideMenuBar' ),
      alwaysOnTop: config.get( 'boolIsAlwaysOnTop' ),
      closable: ! config.get( 'boolIsAlwaysOpen' ),
      darkTheme: config.get( 'boolUseDarkTheme' ),
    },
    defaultOptions: {
      width: 300,
      height: 300,
    },
    fileName: 'index-api-ai',
    isOpen: false,
  },
  wake: {
    instance: null,
    options: {
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      show: false,
    },
    fileName: 'live_kws',
    folderName: 'wake-pocketsphinx-js',
    isOpen: false,
  },
  activation: {
    instance: null,
    options: {
      width: 818,
      height: 606,
      useContentSize: true,
      darkTheme: config.get( 'boolUseDarkTheme' ),
      frame: false,
    },
    fileName: 'activation',
    isOpen: false,
  },
  checkProcessRunning: {
    instance: null,
    options: {
      width: 400,
      height: 400,
      show: false,
    },
    fileName: 'check-process-running',
    folderName: 'helper-native-messaging',
    isOpen: false,
  },
};

// Restore index window position
if ( config.get( 'boolRememberIndexWindowPosition' ) ) {
  restoreWindowIntegerParameters( 'intIndexWindowPosition', 'X', 'Y' );
}

// Restore index window size
if ( config.get( 'boolRememberIndexWindowSize' ) ) {
  restoreWindowIntegerParameters( 'intIndexWindow', 'Width', 'Height' );
}

/**
 * Restore a same-kind-of-type group of integer parameters.
 * For example, a group of position- or size-related parameters.
 *
 * @param {string} strParameterVarNamePrefix - The prefix of the parameter variable name.
 * @param {...string} arrParametersVarNameAffixes - The affixes of the parameters variables names.
 */

function restoreWindowIntegerParameters( strParameterVarNamePrefix, ...arrParametersVarNameAffixes ) {
  for ( const strParameterVarNameAffix of arrParametersVarNameAffixes ) {
    const intParameter = config.get( strParameterVarNamePrefix + strParameterVarNameAffix );

    if ( Number.isInteger( intParameter ) ) {
      const strParameter = strParameterVarNameAffix.toLowerCase();

      windows.index.options[ strParameter ] = intParameter;
    }
  }
}

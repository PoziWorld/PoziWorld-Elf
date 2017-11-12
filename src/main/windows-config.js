import config from '../shared/config';

/**
 * Describes all available app windows (visible to user and not) and their properties.
 * In Electron terminology, renderer processes.
 *
 * @const {Object}
 */

export const windows = {

  /**
   * The first window user is supposed to see after the installation.
   * Tries to explain what this app is and how it works.
   *
   * Also, displayed if a native messaging host entry is not found in the registry
   * (most likely, deleted by user by accident).
   */

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

  /**
   * The main window of the app.
   * Takes commands from user and sends them to partner extensions.
   */

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

  /**
   * Not shown to user.
   * Open only when the index window is open and a wake phrase is activated.
   * Used in background to listen for the wake phrase (hotword).
   */

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

  /**
   * Brings it to user attention that the app needs to be activated from a partner extension in order for commands to be executed.
   */

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

  /**
   * Not shown to user.
   * Checks whether the app has been activated from a partner extension or opened directly.
   * If opened directly, shows the activation window.
   */

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

const Config = require( 'electron-config' );

const config = new Config( {
  configName: 'settings',
  defaults: {
    boolIsDebugModeOn: false,

    // Language
    strLanguageInterface: 'en-US',
    strLanguageVoice: 'en-US',

    // View
    boolUseDarkTheme: false,
    boolEnableKeyboardNavigationStyles: false,
    boolShowReceivedCommands: true,

    // Window
    boolHasSeenIntroWindow: false,

    boolIsAlwaysOnTop: false,
    boolIsAlwaysOpen: false,

    boolRememberIndexWindowPosition: true,
    intIndexWindowPositionX: null,
    intIndexWindowPositionY: null,

    boolRememberIndexWindowSize: true,
    intIndexWindowWidth: null,
    intIndexWindowHeight: null,

    boolAutoHideMenuBar: false,
    boolAutoCloseIndexWindowWhenNotActivated: true,
    boolKeepActivationWindowOnIndexWindowClosed: false,

    // Wake
    boolWakeAppByHotword: false,
    boolWakeListeningModeByHotword: false,
    boolIsWakeByHotwordGettingReady: false,

    // Updates
    boolDownloadUpdatesAutomatically: true,

    // Analytics
    boolShareAnalyticsAnonymously: false,
  }
} );

export default config;

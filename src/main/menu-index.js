import { app, Menu } from 'electron';

import { windows } from './windows-config';
import { handleWakeWindow, sendMessageToIndexWindow } from './windows-handlers';
import { copyUrl, goToUrl } from '../shared/link-url';
import { toggleAutoDownload } from './updater';
import config from '../shared/config';
import I18n from '../shared/I18n';

const i18n = new I18n( [ 'shared', 'menu-index', 'language' ] );

const template = [
  {
    label: i18n.t( 'settings' ),
    submenu: [
      {
        label: i18n.t( 'language' ),
        submenu: [
          {
            label: i18n.t( 'languageInterface' ),
            submenu: [
              {
                label: i18n.t( 'languageEnglishUnitedStates' ),
                type: 'radio',
                checked: config.get( 'strLanguageInterface' ) === 'en-US',
                enabled: false,
              },
              {
                type: 'separator',
              },
              {
                label: i18n.t( 'helpTranslate' ),
                submenu: [
                  {
                    label: i18n.t( 'urlGoTo' ),
                    click () {
                      goToUrl( { strLink: 'helpTranslate' } );
                    },
                  },
                  {
                    label: i18n.t( 'urlCopy' ),
                    click () {
                      copyUrl( { strLink: 'helpTranslate' } );
                    },
                  },
                ],
              },
            ],
          },
          {
            label: i18n.t( 'languageVoice' ),
            submenu: [
              {
                label: i18n.t( 'languageEnglishUnitedStates' ),
                type: 'radio',
                checked: config.get( 'strLanguageVoice' ) === 'en-US',
                enabled: false,
              },
              {
                type: 'separator',
              },
              {
                label: i18n.t( 'requestCommandLanguage' ),
                submenu: [
                  {
                    label: i18n.t( 'urlGoTo' ),
                    click () {
                      goToUrl( { strLink: 'requestCommandLanguage' } );
                    },
                  },
                  {
                    label: i18n.t( 'urlCopy' ),
                    click () {
                      copyUrl( { strLink: 'requestCommandLanguage' } );
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: i18n.t( 'view' ),
        submenu: [
          {
            label: i18n.t( 'useDarkTheme' ),
            type: 'checkbox',
            checked: config.get( 'boolUseDarkTheme' ),
            click( menuItem, focusedWindow ) {
              const boolUseDarkThemeNew = ! config.get( 'boolUseDarkTheme' );

              config.set( 'boolUseDarkTheme', boolUseDarkThemeNew );

              sendMessageToIndexWindow( 'use-dark-theme', boolUseDarkThemeNew );
            },
          },
          {
            label: i18n.t( 'enableKeyboardNavigationStyles' ),
            type: 'checkbox',
            checked: config.get( 'boolEnableKeyboardNavigationStyles' ),
            click( menuItem, focusedWindow ) {
              const boolEnableKeyboardNavigationStylesNew = ! config.get( 'boolEnableKeyboardNavigationStyles' );

              config.set( 'boolEnableKeyboardNavigationStyles', boolEnableKeyboardNavigationStylesNew );

              sendMessageToIndexWindow( 'enable-keyboard-navigation-styles', boolEnableKeyboardNavigationStylesNew );
            },
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t( 'showReceivedCommands' ),
            type: 'checkbox',
            checked: config.get( 'boolShowReceivedCommands' ),
            click( menuItem, focusedWindow ) {
              const boolShowReceivedCommandsNew = ! config.get( 'boolShowReceivedCommands' );

              config.set( 'boolShowReceivedCommands', boolShowReceivedCommandsNew );

              sendMessageToIndexWindow( 'show-received-commands', boolShowReceivedCommandsNew );
            },
          },
        ],
      },
      {
        label: i18n.t( 'window' ),
        submenu: [
          {
            label: i18n.t( 'alwaysOnTop' ),
            type: 'checkbox',
            checked: config.get( 'boolIsAlwaysOnTop' ),
            click( menuItem, focusedWindow ) {
              const boolIsAlwaysOnTopNew = ! config.get( 'boolIsAlwaysOnTop' );

              if ( focusedWindow ) {
                focusedWindow.setAlwaysOnTop( boolIsAlwaysOnTopNew );
                config.set( 'boolIsAlwaysOnTop', boolIsAlwaysOnTopNew );
              }
            },
          },
          {
            label: i18n.t( 'alwaysOpen' ),
            type: 'checkbox',
            checked: config.get( 'boolIsAlwaysOpen' ),
            click( menuItem, focusedWindow ) {
              const boolIsAlwaysOpen = config.get( 'boolIsAlwaysOpen' );

              if ( focusedWindow ) {
                focusedWindow.setClosable( boolIsAlwaysOpen );
                config.set( 'boolIsAlwaysOpen', ! boolIsAlwaysOpen );
              }
            },
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t( 'rememberWindowPosition' ),
            type: 'checkbox',
            checked: config.get( 'boolRememberIndexWindowPosition' ),
            click( menuItem, focusedWindow ) {
              config.set( 'boolRememberIndexWindowPosition', ! config.get( 'boolRememberIndexWindowPosition' ) );
            },
          },
          {
            label: i18n.t( 'rememberWindowSize' ),
            type: 'checkbox',
            checked: config.get( 'boolRememberIndexWindowSize' ),
            click( menuItem, focusedWindow ) {
              config.set( 'boolRememberIndexWindowSize', ! config.get( 'boolRememberIndexWindowSize' ) );
            },
          },
          {
            label: i18n.t( 'restoreDefaultWindowSize' ),
            click( menuItem, focusedWindow ) {
              if ( focusedWindow ) {
                const objDefaultOptions = windows.index.defaultOptions;

                focusedWindow.setSize( objDefaultOptions.width, objDefaultOptions.height );
              }
            },
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t( 'autoHideMenuBar' ),
            type: 'checkbox',
            checked: config.get( 'boolAutoHideMenuBar' ),
            click( menuItem, focusedWindow ) {
              const boolAutoHideMenuBarNew = ! config.get( 'boolAutoHideMenuBar' );

              if ( focusedWindow ) {
                focusedWindow.setAutoHideMenuBar( boolAutoHideMenuBarNew );
                config.set( 'boolAutoHideMenuBar', boolAutoHideMenuBarNew );
              }
            },
          },
          {
            label: i18n.t( 'autoCloseWindowWhenNotActivated' ),
            type: 'checkbox',
            checked: config.get( 'boolAutoCloseIndexWindowWhenNotActivated' ),
            click( menuItem, focusedWindow ) {
              const boolAutoCloseIndexWindowWhenNotActivatedNew = ! config.get( 'boolAutoCloseIndexWindowWhenNotActivated' );

              config.set( 'boolAutoCloseIndexWindowWhenNotActivated', boolAutoCloseIndexWindowWhenNotActivatedNew );
            },
          },
        ],
      },
      {
        label: i18n.t( 'wake' ),
        submenu: [
          {
            label: i18n.t( 'wakeApp' ),
            submenu: [
              {
                label: i18n.t(
                  'featureInBeta',
                  {
                    feature: i18n.t(
                      'wakeByHotword',
                      {
                        enabledHotword1: i18n.t(
                          'availableHotword1',
                        ),
                      },
                    ),
                  },
                ),
                type: 'checkbox',
                checked: config.get( 'boolWakeAppByHotword' ),
                click( menuItem, focusedWindow ) {
                  const boolWakeAppByHotwordNew = ! config.get( 'boolWakeAppByHotword' );

                  config.set( 'boolWakeAppByHotword', boolWakeAppByHotwordNew );

                  onWakeHotwordSettingChange();
                },
              },
              {
                label: i18n.t(
                  'featureComingSoon',
                  {
                    feature: i18n.t(
                      'wakeByKeyboardShortcut',
                    ),
                  },
                ),
                enabled: false,
              },
            ],
          },
          {
            label: i18n.t( 'wakeListeningMode' ),
            submenu: [
              {
                label: i18n.t(
                  'featureInBeta',
                  {
                    feature: i18n.t(
                      'wakeByHotword',
                      {
                        enabledHotword1: i18n.t(
                          'availableHotword1',
                        ),
                      },
                    ),
                  },
                ),
                type: 'checkbox',
                checked: config.get( 'boolWakeListeningModeByHotword' ),
                click( menuItem, focusedWindow ) {
                  const boolWakeListeningModeByHotwordNew = ! config.get( 'boolWakeListeningModeByHotword' );

                  config.set( 'boolWakeListeningModeByHotword', boolWakeListeningModeByHotwordNew );

                  sendMessageToIndexWindow( 'toggle-listening-mode-wake-by-hotword', boolWakeListeningModeByHotwordNew );
                  onWakeHotwordSettingChange();
                },
              },
              {
                label: i18n.t(
                  'featureComingSoon',
                  {
                    feature: i18n.t(
                      'wakeByKeyboardShortcut',
                    ),
                  },
                ),
                enabled: false,
              },
            ],
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t( 'updates' ),
        submenu: [
          {
            label: i18n.t( 'downloadUpdatesAutomatically' ),
            type: 'checkbox',
            checked: config.get( 'boolDownloadUpdatesAutomatically' ),
            click( menuItem, focusedWindow ) {
              const boolDownloadUpdatesAutomaticallyNew = ! config.get( 'boolDownloadUpdatesAutomatically' );

              config.set( 'boolDownloadUpdatesAutomatically', boolDownloadUpdatesAutomaticallyNew );

              toggleAutoDownload( boolDownloadUpdatesAutomaticallyNew );
            },
          },
          {
            label: i18n.t(
              'featureComingSoon',
              {
                feature: i18n.t(
                  'checkForUpdatesNow',
                ),
              },
            ),
            enabled: false,
            click( menuItem, focusedWindow ) {
              /**
               * @todo
               */
            },
          },
        ],
      },
      {
        label: i18n.t( 'analytics' ),
        submenu: [
          {
            label: i18n.t(
              'featureComingSoon',
              {
                feature: i18n.t(
                  'shareAnalyticsAnonymously',
                ),
              },
            ),
            type: 'checkbox',
            enabled: false,
            checked: config.get( 'boolShareAnalyticsAnonymously' ),
            click( menuItem, focusedWindow ) {
              const boolShareAnalyticsAnonymouslyNew = ! config.get( 'boolShareAnalyticsAnonymously' );

              config.set( 'boolShareAnalyticsAnonymously', boolShareAnalyticsAnonymouslyNew );

              // toggleAnalytics( boolShareAnalyticsAnonymouslyNew );
            },
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: i18n.t( 'commands' ),
        submenu: [
          {
            label: i18n.t( 'commandsList' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'commandsList' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'commandsList' } );
                },
              },
            ],
          },
          {
            label: i18n.t( 'commandsFaq' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'commandsFaq' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'commandsFaq' } );
                },
              },
            ],
          },
        ],
      },
      {
        label: i18n.t( 'partnerExtensions' ),
        submenu: [
          {
            label: i18n.t( 'pozitone' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'pozitone' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'pozitone' } );
                }
              },
            ],
          },
          // {
          //   label: i18n.t( 'sttb' ),
          //   submenu: [
          //     {
          //       label: i18n.t( 'urlGoTo' ),
          //       click () { require( 'electron' ).shell.openExternal( 'https://chrome.google.com/webstore/detail/scroll-to-top-button/chinfkfmaefdlchhempbfgbdagheknoj' ) }
          //     },
          //     {
          //       label: i18n.t( 'urlCopy' ),
          //       click () { clipboard.writeText( 'https://chrome.google.com/webstore/detail/scroll-to-top-button/chinfkfmaefdlchhempbfgbdagheknoj' ) }
          //     }
          //   ]
          // },
          {
            label: i18n.t( 'moreComingSoon' ),
            enabled: false,
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t( 'becomePartner' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'becomePartner' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'becomePartner' } );
                },
              },
            ],
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t( 'terms' ),
        submenu: [
          {
            label: i18n.t( 'urlGoTo' ),
            click () {
              goToUrl( { strLink: 'terms' } );
            },
          },
          {
            label: i18n.t( 'urlCopy' ),
            click () {
              copyUrl( { strLink: 'terms' } );
            },
          },
        ],
      },
      {
        label: i18n.t( 'privacy' ),
        submenu: [
          {
            label: i18n.t( 'privacyPolicy' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'privacyPolicy' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'privacyPolicy' } );
                },
              },
            ],
          },
          {
            label: i18n.t( 'privacyFaq' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'privacyFaq' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'privacyFaq' } );
                },
              },
            ],
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t( 'contribution' ),
        submenu: [
          {
            label: i18n.t( 'share' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'share' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'share' } );
                },
              },
            ],
          },
          {
            label: i18n.t( 'incentive' ),
            submenu: [
              {
                label: i18n.t( 'urlGoTo' ),
                click () {
                  goToUrl( { strLink: 'incentive' } );
                },
              },
              {
                label: i18n.t( 'urlCopy' ),
                click () {
                  copyUrl( { strLink: 'incentive' } );
                },
              },
            ],
          },
        ],
      },
      {
        label: i18n.t( 'acknowledgements' ),
        submenu: [
          {
            label: i18n.t( 'urlGoTo' ),
            click () {
              goToUrl( { strLink: 'acknowledgements' } );
            },
          },
          {
            label: i18n.t( 'urlCopy' ),
            click () {
              copyUrl( { strLink: 'acknowledgements' } );
            },
          },
        ],
          /**
           * @todo
           */
        // click () {
          // loadWindow( 'acknowledgements' );
        // },
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t( 'feedback' ),
        submenu: [
          {
            label: i18n.t( 'urlGoTo' ),
            click () {
              goToUrl( { strLink: 'feedback' } );
            },
          },
          {
            label: i18n.t( 'urlCopy' ),
            click () {
              copyUrl( { strLink: 'feedback' } );
            },
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t(
          'version',
          {
            version: app.getVersion(),
            bit: process.arch.replace( /\D/g,'' ),
          },
        ),
        enabled: false,
      },
      {
        label: i18n.t( 'copyright' ),
        enabled: false,
      },
    ],
  },
];

const menu = Menu.buildFromTemplate( template );

Menu.setApplicationMenu( menu );

/**
 * User either enabled or disabled wake app or listening mode by hotword setting.
 */

function onWakeHotwordSettingChange() {
  handleWakeWindow( true );
}

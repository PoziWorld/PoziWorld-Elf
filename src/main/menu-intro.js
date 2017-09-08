import { Menu } from 'electron';

import config from '../shared/config';
import I18n from '../shared/I18n';

import { windows } from './windows-config';
const i18n = new I18n( [ 'shared', 'language' ] );

const template = [
  {
    label: i18n.t( 'settings' ),
    submenu: [
      {
        label: i18n.t( 'language' ),
        submenu: [
          {
            label: i18n.t( 'languageEnglishUnitedStates' ),
            type: 'radio',
            checked: config.get( 'strLanguageInterface' ) == 'en-US',
            enabled: false,
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

              windows.intro.instance.webContents.send( 'use-dark-theme', boolUseDarkThemeNew );
            },
          },
        ],
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      },
    ],
  },
];

const menu = Menu.buildFromTemplate( template );

Menu.setApplicationMenu( menu );

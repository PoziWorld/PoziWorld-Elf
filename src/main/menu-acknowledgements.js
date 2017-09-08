import { Menu } from 'electron';

import config from '../shared/config';
import I18n from '../shared/I18n';

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
    ],
  },
];

export const menu = Menu.buildFromTemplate( template );

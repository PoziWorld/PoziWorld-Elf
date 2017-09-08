import { useDarkTheme, enableKeyboardNavigationStyles, renderOnReady } from '../../shared/view';
useDarkTheme();
enableKeyboardNavigationStyles();

import App, { i18n } from './component-app';
renderOnReady( App, i18n.getInstance() );

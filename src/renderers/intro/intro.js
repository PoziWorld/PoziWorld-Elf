import { useDarkTheme, renderOnReady } from '../../shared/view';
useDarkTheme();

import Intro, { i18n } from './component-intro';
renderOnReady( Intro, i18n.getInstance() );

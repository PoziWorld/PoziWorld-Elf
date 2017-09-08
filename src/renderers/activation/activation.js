import { useDarkTheme, renderOnReady } from '../../shared/view';
useDarkTheme();

import Activation, { i18n } from './component-activation';
renderOnReady( Activation, i18n.getInstance() );

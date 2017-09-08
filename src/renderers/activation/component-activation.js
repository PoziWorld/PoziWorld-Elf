import React from 'react';
import { translate } from 'react-i18next';

import I18n from '../../shared/I18n';
import { addDarkThemeToggleEventListener } from '../../shared/view';

import './activation.css';

const arrI18nNamespaces = [ 'shared', 'renderer-activation' ];
export const i18n = new I18n( arrI18nNamespaces );

class Activation extends React.Component {
  constructor( props ) {
    super( props );
  }

  componentDidMount() {
    addDarkThemeToggleEventListener();
  }

  handleClick = ( e ) => {
    window.close();
  };

  render() {
    return (
      <div id="activation">
        <figure>
          <img
            src="activation.gif"
            alt={ i18n.t( 'demoActivate' ) }
            title={ i18n.t( 'noActivation' ) }
              />
          <figcaption>
            { i18n.t( 'demoActivate' ) }
          </figcaption>
        </figure>
        <button className="pwCta" onClick={ this.handleClick }>
          <span className="pwVisuallyHidden">
            { i18n.t( 'close' ) }
          </span>
        </button>
      </div>
    );
  }
}

export default translate( arrI18nNamespaces )( Activation );

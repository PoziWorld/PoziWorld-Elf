import React from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron';
import I18n from '../../shared/I18n';
import log from '../../shared/log';

import './acknowledgements.css';

const i18n = new I18n( [ 'renderer-acknowledgements' ] );

class Intro extends React.Component {
  constructor( props ) {
    super( props );
  }

  handleLinkClick = ( e ) => {
    log.add( 'Elf: acknowledgement click', this );

    ipcRenderer.send( 'acknowledgements-next-message' );
  }

  render() {
    const arrAcknowledgements = [
      {
        strName: 'microphoneIcon',
        strUrl: 'https://thenounproject.com/term/microphone/250540/',
      },
    ];
    const $$list = (
      <ul id="acknowledgementsList">
        { arrAcknowledgements.map( ( objAcknowledgement ) =>
          <li key={ objAcknowledgement.strName }>
            { objAcknowledgement.strUrl ? (
              <a href={ objAcknowledgement.strUrl } target="_blank" onClick={ this.handleLinkClick }>
                { i18n.t( objAcknowledgement.strName ) }
              </a>
            ) : (
              <span>
                { i18n.t( objAcknowledgement.strName ) }
              </span>
            ) }
          </li>
        )}
      </ul>
    );

    return (
      <div id="acknowledgements">
        <h3>
          { i18n.t( 'acknowledgements' ) }
        </h3>
        { $$list }
      </div>
    );
  }
}

function run() {
  ReactDOM.render(
    <Intro />,
    document.getElementById( 'root' )
  );
}

const loadedStates = [ 'complete', 'loaded', 'interactive' ];

if ( loadedStates.includes( document.readyState ) && document.body ) {
  run();
}
else {
  window.addEventListener( 'DOMContentLoaded', run, false );
}

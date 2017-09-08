import React from 'react';

import './microphone.min';
import './microphone.min.css';
import './Microphone.css';

import sendMessage from '../shared/native-messaging-helper';

export default class Microphone extends React.Component {
  constructor( props ) {
    super( props );
  }

  componentDidMount() {
    const $$mic = document.getElementById( 'microphone' );
    const $$note = document.getElementById( 'note' );

    ipc.on( 'wake-listening-mode', ( objEvent, boolWake ) => {
      $$mic.click();
    } );

    const mic = new Wit.Microphone( $$mic );

    this.setState( {
      mic: mic
    } );

    const info = function ( msg ) {
      document.getElementById( 'info' ).innerHTML = msg;
    };

    const error = function ( msg ) {
      document.getElementById( 'error' ).innerHTML = msg;
    };

    mic.onready = function () {
      info( 'Elf is ready for your command' );
    };

    mic.onaudiostart = function () {
      info( 'Elf is all ears' );
      error( '' );
      $$note.hidden = false;
    };

    mic.onaudioend = function () {
      info( 'Elf is thinking' );
      $$note.hidden = true;
    };

    mic.onresult = function ( intent, entities ) {
      let r = kv( 'intent', intent );

      for ( const k in entities ) {
        const e = entities[ k ];

        if ( ! ( e instanceof Array ) ) {
          r += kv( k, e.value );
        }
        else {
          for ( let i = 0, l = e.length; i < l; i++ ) {
            r += kv( k, e[ i ].value );
          }
        }
      }

      document.getElementById( 'result' ).innerHTML = r;

      // because Object.keys(new Date()).length === 0;
      // we have to do some additional check
      if ( Object.keys( entities ).length !== 0 && entities.constructor === Object ) {
        console.log( 'entities', JSON.stringify( entities ) );
        sendMessage( JSON.stringify( entities ) );
      }
    };

    mic.onerror = function ( err ) {
      error( 'Error: ' + err );
    };

    mic.onconnecting = function () {
      info( 'Elf is warming up' );
    };

    mic.ondisconnected = function () {
      info( 'Elf is tired. Come back later.' );
    };

    mic.connect( 'G5HCNLOXDKQV2MV76CXXZU74JHUCAJ5N' );
    mic.start();
    mic.stop();

    function kv ( k, v ) {
      if ( toString.call( v ) !== '[object String]' ) {
        v = JSON.stringify( v );
      }

      return k + '=' + v + "\n";
    }
  }

  render() {
    return (
      <div>
        <div id="microphone"></div>
        <pre id="result" hidden></pre>
        <div id="info" hidden></div>
        <div id="error" hidden></div>
        <p id="note" hidden>
          Click red microphone when done *
          <br />
          <small><sub>* Will be fixed soon.</sub></small>
        </p>
      </div>
    );
  }
}

import { ipcRenderer } from 'electron';
import React from 'react';
import { translate, Interpolate } from 'react-i18next';

import config from '../../shared/config';
import I18n from '../../shared/I18n';
import log from '../../shared/log';
import { addDarkThemeToggleEventListener, addKeyboardNavigationStylesToggleEventListener } from '../../shared/view';
import { createLink } from '../shared/component-link';

import './api-ai.css';

const arrI18nNamespaces = [ 'shared', 'renderer-index-api-ai' ];
export const i18n = new I18n( arrI18nNamespaces );

const strListeningModeWakeByHotwordEnabled = 'isListeningModeWakeByHotwordEnabled';

class App extends React.Component {
  constructor( props ) {
    super( props );
  }

  componentDidMount() {
    require( './api-ai.js' );

    const apiAiClient = window.apiAiClient;
    const $$queryResult = window.apiAiClient.queryResult;
    const $$mic = window.apiAiClient.mic;
    let intMicrophoneTimer;

    $$mic.addEventListener( 'click', onMicClick );

    ipcRenderer.on( 'wake-listening-mode', onWakeListeningMode );
    ipcRenderer.on( 'toggle-listening-mode-wake-by-hotword', onToggleListeningModeWakeByHotword );
    ipcRenderer.on( 'notify-wake-by-hotword-status', onNotifyWakeByHotwordStatus );
    ipcRenderer.on( 'show-received-commands', onShowReceivedCommands );
    ipcRenderer.on( 'notify-no-activation', onNotifyNoActivation );
    ipcRenderer.on( 'on-update-downloaded', onUpdateDownloaded );

    addDarkThemeToggleEventListener();
    addKeyboardNavigationStylesToggleEventListener();

    checkWakeByHotwordStatus();

    /**
     * When the microphone icon call-to-action is clicked.
     *
     * @param {Object} objEvent - The event object.
     */

    function onMicClick( objEvent ) {
      // http://stackoverflow.com/a/29972322
      const intInterval = 1000; // ms
      const intMaxRecordingTime = 14000; // ms - Google charges per 15 seconds, make sure to not go over that
      const intDateNow = Date.now();
      let intExpectedDateNow = intDateNow + intInterval;

      // Reset timer, so that it doesn't abruptly stop listening
      if ( typeof intMicrophoneTimer === 'number' ) {
        clearTimeout( intMicrophoneTimer );
        intMicrophoneTimer = undefined;
      }

      intMicrophoneTimer = setTimeout( step, intInterval );

      function step() {
        const intDateNow2 = Date.now();
        const intDelta = intDateNow2 - intExpectedDateNow; // the drift (positive for overshooting)

        if ( intDelta > intInterval ) {
          // something really bad happened. Maybe the browser (tab) was inactive?
          // possibly special handling to avoid futile "catch up" run
        }

        // Limit not reached
        if ( ( intDateNow2 - intDateNow ) < intMaxRecordingTime ) {
          intExpectedDateNow += intInterval;

          intMicrophoneTimer = setTimeout( step, Math.max( 0, intInterval - intDelta ) ); // take into account drift
        }
        /**
         * @todo Show countdown: 3, 2, 1, 0.
         * @todo This shouldn't be run if was stopped after started and then started again.
         */
        // Limit reached, stop recording
        else if ( apiAiClient.isRecognizing() ) {
          apiAiClient.toggleRecognition();
        }
      }
    }

    /**
     * When the wake (hot)word is recognized.
     *
     * @param {Object} objEvent - The event object.
     */

    function onWakeListeningMode( objEvent ) {
      $$mic.click();
    }

    /**
     * When the listening mode wake by hotword is enabled or disabled.
     *
     * @param {Object} objEvent - The event object.
     * @param {Boolean} boolEnable - Whether the wake is enabled.
     */

    function onToggleListeningModeWakeByHotword( objEvent, boolEnable ) {
      if ( typeof boolEnable === 'boolean' ) {
        $$queryResult.classList.toggle( strListeningModeWakeByHotwordEnabled, boolEnable );
      }
    }

    /**
     * When the wake by hotword is ready or getting ready to listen.
     *
     * @param {Object} [objEvent] - The event object.
     * @param {Boolean} [boolIsReady] - Whether the wake by hotword is ready.
     */

    function onNotifyWakeByHotwordStatus( objEvent, boolIsReady ) {
      toggleElement(
        document.getElementById( 'wakeByHotwordStatusCta' ),
        typeof boolIsReady === 'boolean' && ! boolIsReady,
      );
    }

    /**
     * Check whether wake by hotword is getting ready or not.
     */

    function checkWakeByHotwordStatus() {
      const boolIsWakeByHotwordGettingReady = config.get( 'boolIsWakeByHotwordGettingReady' );

      if ( typeof boolIsWakeByHotwordGettingReady === 'boolean' && boolIsWakeByHotwordGettingReady ) {
        onNotifyWakeByHotwordStatus( undefined, false );
      }
    }

    /**
     * When the corresponding setting is toggled in the app menu.
     *
     * @param {Object} objEvent - The event object.
     * @param {Boolean} boolShow - Whether to show the received commands or not.
     */

    function onShowReceivedCommands( objEvent, boolShow ) {
      if ( typeof boolShow === 'boolean' ) {
        $$queryResult.classList.toggle( 'disabled', ! boolShow );
      }
    }

    /**
     * When the wake (hot)word is recognized.
     *
     * @param {Object} objEvent - The event object.
     */

    function onNotifyNoActivation( objEvent ) {
      toggleElement( document.getElementById( 'noActivationCta' ) );
    }

    /**
     * Update has been downloaded. It will be applied on the app exit.
     *
     * @param {Object} objEvent - The event object.
     */

    function onUpdateDownloaded( objEvent ) {
      toggleElement( document.getElementById( 'updateDownloadedCta' ) );
    }

    /**
     * Helper to make the element show up or disappear (hide).
     *
     * @param {Node} $$element - The element to show (unhide).
     * @param {Boolean} [boolShow] - Whether to show (default) or hide the element.
     */

    function toggleElement( $$element, boolShow ) {
      let boolIsHidden = false;

      if ( typeof boolShow === 'boolean' && ! boolShow ) {
        boolIsHidden = true;
      }

      $$element.hidden = boolIsHidden;
      $$element.setAttribute( 'aria-hidden', boolIsHidden.toString() );
    }
  }

  handleNoActivationCtaClick = ( e ) => {
    log.add( 'Elf: click No Activation', this );

    ipcRenderer.send( 'request-load-window', 'activation' );
  };

  render() {
    const boolShowReceivedCommands = config.get( 'boolShowReceivedCommands' );
    const boolWakeListeningModeByHotword = config.get( 'boolWakeListeningModeByHotword' );

    return (
      <div>
        <button id="mic" className="pwCta">
          <span className="pwVisuallyHidden">
            { i18n.t( 'giveCommand' ) }
          </span>
        </button>
        <input type="hidden" name="q" id="query" />
        <div id="resultWrapper">
          <p
            id="result"
            className={ ! boolShowReceivedCommands ?
              'disabled' :
              boolWakeListeningModeByHotword ?
                strListeningModeWakeByHotwordEnabled :
                ''
            }
            data-command-prefix={ i18n.t( 'commandPrefix' ) }
              >
            <Interpolate
              i18nKey={ 'microphoneWelcomeMessageListeningModeWakeEnabled' }
              className={ 'pwWelcomeMessage pwWelcomeMessage1' }
              enabledHotword1={ i18n.t( 'availableHotword1' ) }
              commandsListLink={ createLink( {
                i18n,
                strContent: 'commandsListLink',
                strTitle: 'seeAvailableCommandsList',
              } ) }
                />
            <Interpolate
              i18nKey={ 'microphoneWelcomeMessage' }
              className={ 'pwWelcomeMessage pwWelcomeMessage2' }
              commandsListLink={ createLink( {
                i18n,
                strContent: 'commandsListLink',
                strTitle: 'seeAvailableCommandsList',
              } ) }
                />
          </p>
        </div>
        <aside
          id="notifications1"
          className="notifications"
            >
          <button
            id="noActivationCta"
            className="pwCta"
            title={ i18n.t( 'noActivation' ) }
            hidden
            aria-hidden="true"
            onClick={ this.handleNoActivationCtaClick }
              >
            <span className="pwVisuallyHidden">
              { i18n.t( 'noActivation' ) }
            </span>
          </button>
          <button
            id="wakeByHotwordStatusCta"
            className="pwCta"
            title={ i18n.t( 'wakeByHotwordStatus' ) }
            hidden
            aria-hidden="true"
            disabled
            aria-disabled="true"
              >
            <span className="pwVisuallyHidden">
              { i18n.t( 'wakeByHotwordStatus' ) }
            </span>
          </button>
        </aside>
        <aside
          id="notifications2"
          className="notifications"
            >
          <button
            id="updateDownloadedCta"
            className="pwCta"
            title={ i18n.t( 'updateDownloaded' ) }
            hidden
            aria-hidden="true"
            disabled
            aria-disabled="true"
              >
            <span className="pwVisuallyHidden">
              { i18n.t( 'updateDownloaded' ) }
            </span>
          </button>
        </aside>
      </div>
    );
  }
}

export default translate( arrI18nNamespaces )( App );

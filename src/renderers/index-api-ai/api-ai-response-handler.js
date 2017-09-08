import sendMessage from '../shared/native-messaging-helper';
import * as utils from '../../shared/elf-utils';

/**
 * Process API.AI response to find whether a recognized command has been called.
 *
 * @param {XMLHttpRequest} objXmlHttpRequest - XMLHttpRequest object.
 */

export function handleResponse( objXmlHttpRequest ) {
  const strResponse = objXmlHttpRequest.response;

  if ( ! utils.isStringEmpty( strResponse ) ) {
    const objResponse = JSON.parse( strResponse );

    if ( ! utils.isObjectEmpty( objResponse ) ) {
      const objResult = objResponse.result;

      if ( ! utils.isObjectEmpty( objResult ) ) {
        const objMetadata = objResult.metadata;

        if ( ! utils.isObjectEmpty( objMetadata ) ) {
          const strIntentName = objMetadata.intentName;

          if ( ! utils.isStringEmpty( strIntentName ) ) {
            const objParameters = objResult.parameters;

            if ( ! utils.isObjectEmpty( objParameters ) ) {
              switch ( strIntentName ) {
                case 'Toggle playback':
                  handlePlayback( objParameters );
                  break;
                case 'Switch track':
                  handleTrack( objParameters );
                  break;
                case 'Change volume':
                  handleVolume( objParameters );
                  break;
                case 'Show notification':
                  handleNotification( objParameters );
                  break;
                case 'Open webpage':
                  handleWebpage( objParameters );
                  break;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Process a playback-related command (play, stop, pause, etc.).
 *
 * @param {Object} objParameters - The command related parameters.
 */

function handlePlayback( objParameters ) {
  const strPlayback = objParameters.playback;

  if ( ! utils.isStringEmpty( strPlayback ) ) {
    sendMessageHelper( strPlayback );
  }
}

/**
 * Process a track-related command (next, previous).
 *
 * @param {Object} objParameters - The command related parameters.
 */

function handleTrack( objParameters ) {
  const strTrack = objParameters.track;

  if ( ! utils.isStringEmpty( strTrack ) ) {
    sendMessageHelper( strTrack );
  }
}

/**
 * Process a volume-related command (mute, unmute, etc.).
 *
 * @param {Object} objParameters - The command related parameters.
 */

function handleVolume( objParameters ) {
  const strVolume = objParameters.volume;

  if ( ! utils.isStringEmpty( strVolume ) ) {
    sendMessageHelper( strVolume );
  }
}

/**
 * Process a notification-related command (show notification, etc.).
 *
 * @param {Object} objParameters - The command related parameters.
 */

function handleNotification( objParameters ) {
  sendMessageHelper( 'show notification' );
}

/**
 * Process a webpage-related command (open a certain website, etc.).
 *
 * @param {Object} objParameters - The command related parameters.
 */

function handleWebpage( objParameters ) {
  const strWebpage = objParameters.webpage;

  if ( ! utils.isStringEmpty( strWebpage ) ) {
    sendMessageHelper( 'open', { strWebpage: strWebpage } );
  }
}

/**
 * Prepare the message for sending.
 *
 * @param {string} strCommand - The recognized command.
 * @param {Object} [objCommandParameters] - The command-associated parameters.
 */

function sendMessageHelper( strCommand, objCommandParameters ) {
  sendMessage( JSON.stringify( {
    strCommand: strCommand,
    objCommandParameters: objCommandParameters,
    intTimestamp: Date.now()
  } ) );
}

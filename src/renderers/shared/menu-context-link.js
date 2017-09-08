const { ipcRenderer, remote } = require( 'electron' );
const { Menu } = remote;

import { copyUrl, goToUrl } from '../../shared/link-url';
import I18n from '../../shared/I18n';
import * as utils from '../../shared/elf-utils';

const i18n = new I18n( [ 'shared' ] );

const template = [
  {
    label: i18n.t( 'urlGoTo' ),
    click ( item, focusedWindow, event ) {
      handleClick( 'goToUrl' );
    }
  },
  {
    label: i18n.t( 'urlCopy' ),
    click ( item, focusedWindow, event ) {
      handleClick( 'copyUrl' );
    }
  },
];

export const linkContextMenu = Menu.buildFromTemplate( template );

ipcRenderer.on( 'send-link-data', onSendLinkData );

/**
 * Request the link properties to act on.
 *
 * @param {string} strAction - The action to take after the data has been received.
 */

function handleClick( strAction ) {
  ipcRenderer.send( 'request-link-data', strAction );
}

/**
 * Retrieve the link properties for the context menu to act on.
 *
 * @param {Object} objEvent - The event object.
 * @param {string} strAction - The action to take on the link.
 * @param {Object} objLinkData - The link properties.
 */

function onSendLinkData( objEvent, strAction, objLinkData ) {
  if ( ! utils.isStringEmpty( strAction ) && ! utils.isObjectEmpty( objLinkData ) ) {
    if ( strAction === 'goToUrl' ) {
      goToUrl( objLinkData );
    }
    else if ( strAction === 'copyUrl' ) {
      copyUrl( objLinkData );
    }
  }
}

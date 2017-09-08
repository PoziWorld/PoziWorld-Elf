import { ipcMain } from 'electron';

import * as utils from '../shared/elf-utils';

let objLinkData = {};

ipcMain.on( 'save-link-data', onSaveLinkData );
ipcMain.on( 'request-link-data', onRequestLinkData );

/**
 * Remember the link properties for the context menu to act on.
 *
 * @param {Object} objEvent - The event object.
 * @param {Object} objLinkDataNew - The link properties.
 */

function onSaveLinkData( objEvent, objLinkDataNew ) {
  if ( ! utils.isObjectEmpty( objLinkDataNew ) ) {
    objLinkData = objLinkDataNew;
  }
}

/**
 * Retrieve the link properties for the context menu to act on.
 *
 * @param {Object} objEvent - The event object.
 * @param {string} strAction - The action to take on the link.
 */

function onRequestLinkData( objEvent, strAction ) {
  if ( ! utils.isStringEmpty( strAction ) && ! utils.isObjectEmpty( objLinkData ) ) {
    objEvent.sender.send( 'send-link-data', strAction, objLinkData );
  }
}

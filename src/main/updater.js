import { autoUpdater } from 'electron-updater';
import winston from 'winston';
import { windows } from './windows-config';
import { isWindowOpen } from './windows-handlers';

import config from '../shared/config';

const logger = new winston.Logger( {
  level: 'info',
  transports: [
    new ( winston.transports.Console )(),
    new ( winston.transports.File )( {
      filename: 'elf-updater.log',
    } ),
  ],
} );

autoUpdater.logger = logger;

toggleAutoDownload( config.get( 'boolDownloadUpdatesAutomatically' ) );

autoUpdater.signals.updateDownloaded( onUpdateDownloaded );

/**
 * Define whether to automatically download an update when it is found.
 *
 * @param {Boolean} boolDownloadUpdatesAutomatically - Whether to automatically download an update when it is found.
 */

export function toggleAutoDownload( boolDownloadUpdatesAutomatically ) {
  autoUpdater.autoDownload = boolDownloadUpdatesAutomatically;
}

/**
 * Update has been downloaded. It will be applied on the app exit.
 *
 * @param {Object} objUpdateInfo - The update info object (contains latest.yml/latest-mac.json data and release data from GitHub release).
 */

function onUpdateDownloaded( objUpdateInfo ) {
  if ( isWindowOpen( 'index' ) ) {
    windows.index.instance.webContents.send( 'on-update-downloaded' );
  }
}

/**
 * Asks the server whether there is an update.
 */

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

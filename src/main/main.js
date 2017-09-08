require( '../../.privategoogleapikey' );

process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;
process.env.ELECTRON_ENABLE_LOGGING = true;
process.env.ELECTRON_ENABLE_STACK_DUMPING = true;

import { app } from 'electron';
import fs from 'fs';

import { windows } from './windows-config';
import { createWindow } from './windows-handlers';
import { checkForUpdates } from './updater';
import { fileNames } from '../shared/file-names';

import './menu-context-helper';

app.on( 'ready', onReady );
app.on( 'window-all-closed', onWindowAllClosed );
app.on( 'activate', onActivate );

/**
 * Emitted when Electron has finished initializing.
 */

function onReady() {
  createWindow();
  checkForUpdates();
}

/**
 * Emitted when all windows have been closed.
 */

function onWindowAllClosed() {
  // Indicate node.exe to autoquit
  if ( windows.index.isOpen ) {
    fs.writeFileSync( fileNames.appState, 'window-all-closed' );
  }

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
}

/**
 * Emitted when the application is activated.
 */

function onActivate() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if ( windows.index.isOpen && windows.index.instance === null || windows.intro.instance == null ) {
    createWindow();
  }
}

import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import config from '../shared/config';
import log from '../shared/log';
import * as utils from '../shared/elf-utils';
import nodeReg from 'node-reg';
import nodeWindows from 'node-windows';
require( 'electron-debug' )( { showDevTools: true } );

import { windows } from './windows-config';
import { fileNames } from '../shared/file-names';

if ( shouldQuit ) {
  app.quit();
  return;
}

ipcMain.on( 'request-load-window', onRequestLoadWindow );

const shouldQuit = app.makeSingleInstance( ( commandLine, workingDirectory ) => {
  const targetWindow = windows.index.isOpen ? windows.index.instance : windows.intro.instance;

  // Someone tried to run a second instance, focus our window
  if ( targetWindow ) {
    if ( targetWindow.isMinimized() ) {
      targetWindow.restore();
    }

    targetWindow.show();
    targetWindow.focus();
  }

  return true;
} );

/**
 * When a Promise is fulfilled.
 *
 * @callback fulfilledCallback
 * @param {*} [result]
 */

/**
 * When a Promise is rejected.
 *
 * @callback rejectedCallback
 * @param {*} [error]
 */

/**
 * Check whether the native messaging host reg key exists, which is required for
 * communication with browser extensions.
 * Resolve or reject.
 *
 * @param {fulfilledCallback} onFulfilled
 * @param {rejectedCallback} onRejected
 */

function checkRegKey( onFulfilled, onRejected ) {
  nodeReg
    .getKey( {
      target: 'HKLM\\SOFTWARE\\Google\\Chrome\\NativeMessagingHosts\\com.poziworld.elf'
    } )
    .then(
      ( result ) => {
        onFulfilled( result );
      },
      ( error ) => {
        onRejected( error );
      }
    );
}

/**
 * Check whether the native messaging host reg key exists, which is required for
 * communication with browser extensions.
 * Based on that, define an appropriate view.
 */

export function createWindow() {
  checkRegKey( onNativeMessagingHostFound, onNativeMessagingHostNotFound );
}

/**
 * The app had been previously connected with the browser.
 *
 * @param {string} strResult - The found registry record.
 */

function onNativeMessagingHostFound( strResult ) {
  log.add( 'Elf: native messaging host found', strResult );

  ipcMain.removeListener( 'on-intro-user-action', onIntroUserAction );

  loadIndexWindow();
}

/**
 * The app had NOT been previously connected with the browser.
 *
 * @param {Object} objError - The error details.
 */

function onNativeMessagingHostNotFound( objError ) {
  log.add( 'Elf: native messaging host NOT found', objError );

  ipcMain.on( 'on-intro-user-action', onIntroUserAction );

  loadIntroWindow();
}

/**
 * User (agreed to) continues from the intro window.
 *
 * @param {Object} objEvent - The event object.
 */

function onIntroUserAction( objEvent ) {
  log.add( 'Elf: intro: click next' );

  const strRegAdd = `reg add HKLM\\SOFTWARE\\Google\\Chrome\\NativeMessagingHosts\\com.poziworld.elf /f /ve /t REG_SZ /d ${ app.getAppPath().replace( '\\resources\\app.asar', '' ) }\\com.poziworld.elf-win.json`;

  nodeWindows.isAdminUser( ( boolIsAdminUser ) => {
    if ( boolIsAdminUser ) {
      log.add( 'Elf: is admin' );

      nodeWindows.elevate( strRegAdd, ( elevateResult ) => {
        log.add( 'Elf: elevate', elevateResult );

        checkRegKey(
          ( result ) => {
            log.add( 'Elf: elevate: reg key: success', elevateResult );

            objEvent.sender.send( 'intro-next-reply', 'success' );
            createWindow();
          },
          ( error ) => {
            log.add( 'Elf: elevate: reg key: error', elevateResult );

            objEvent.sender.send( 'intro-next-reply', 'error' );
          }
        );
      } );
    }
    else {
      log.add( 'Elf: not admin' );

      nodeWindows.sudo( strRegAdd, ( sudoResult ) => {
        log.add( 'Elf: sudo', sudoResult );

        checkRegKey(
          ( result ) => {
            objEvent.sender.send( 'intro-next-reply', 'success' );
            createWindow();
            windows.intro.instance.close();
            windows.intro.instance.destroy();
          },
          ( error ) => {
            objEvent.sender.send( 'intro-next-reply', 'error' );
          }
        );
      } );
    }
  } );
}

/**
 * Load window that has the main functionality of the app (voice control).
 * Create file which will indicate node.exe when to autoquit.
 */

function loadIndexWindow() {
  handleWakeWindow();

  require( './menu-index' );

  windows.index.isOpen = true;

  /**
   * @todo DRY.
   */
  windows.index.instance = new BrowserWindow( windows.index.options );

  windows.index.instance.loadURL( composeWindowUrl( windows.index.fileName, windows.index.folderName ) );

  checkHelperProcess();

  /**
   * @todo DRY.
   */
  windows.index.instance.on( 'show', () => {
    if ( windows.intro.instance != null ) {
      windows.intro.instance.close();
    }
  } );

  /**
   * @todo DRY.
   */
  windows.index.instance.on( 'ready-to-show', () => {
    if ( windows.intro.instance != null ) {
      windows.intro.instance.close();
    }
  } );

  /**
   * @todo DRY.
   */
  windows.index.instance.on( 'focus', () => {
    if ( windows.intro.instance != null ) {
      windows.intro.instance.close();
    }
  } );

  windows.index.instance.on( 'close', () => {
    if ( config.get( 'boolRememberIndexWindowPosition' ) ) {
      const arrIndexWindowPosition = windows.index.instance.getPosition();

      if ( Array.isArray( arrIndexWindowPosition ) ) {
        config.set( 'intIndexWindowPositionX', arrIndexWindowPosition[ 0 ] );
        config.set( 'intIndexWindowPositionY', arrIndexWindowPosition[ 1 ] );
      }
    }

    if ( config.get( 'boolRememberIndexWindowSize' ) ) {
      const arrIndexWindowSize = windows.index.instance.getSize();

      if ( Array.isArray( arrIndexWindowSize ) ) {
        config.set( 'intIndexWindowWidth', arrIndexWindowSize[ 0 ] );
        config.set( 'intIndexWindowHeight', arrIndexWindowSize[ 1 ] );
      }
    }

    // Apply the update
    if ( autoUpdater.updateAvailable ) {
      autoUpdater.quitAndInstall();
    }
  } );

  windows.index.instance.on( 'closed', () => {
    windows.index.instance = null;

    unloadWindow( 'wake' );
    unloadWindow( 'activation' );
  } );

  fs.writeFile( fileNames.appState, 'ready', ( err ) => {
    if ( err ) {
      throw err;
    }

    log.add( 'Elf: app ready!' );
  } );
}

/**
 * Check whether the window that will listen to wake (hot) word to control the app and listening mode needs to be loaded or not.
 *
 * @param {Boolean} [boolCloseIfRunning] - Whether to close the window the wake by hotword gets disabled.
 */

export function handleWakeWindow( boolCloseIfRunning ) {
  if ( shouldWakeAppByHotword() || shouldWakeListeningModeByHotword() ) {
    loadWakeWindow();
  }
  else if ( typeof boolCloseIfRunning === 'boolean' && boolCloseIfRunning ) {
    unloadWindow( 'wake' );
  }
}

/**
 * Check whether the app should have the ability to be woken by hotword.
 *
 * @return {Boolean}
 */

function shouldWakeAppByHotword() {
  return config.get( 'boolWakeAppByHotword' );
}

/**
 * Check whether the listening mode should have the ability to be woken by hotword.
 *
 * @return {Boolean}
 */

function shouldWakeListeningModeByHotword() {
  return config.get( 'boolWakeListeningModeByHotword' );
}

/**
 * Received a request from a renderer to load one of the app windows.
 *
 * @param {Object} objEvent - The event object.
 * @param {string} strWindowName - The window to open.
 */

function onRequestLoadWindow( objEvent, strWindowName ) {
  loadWindow( strWindowName );
}

/**
 * Load window that will listen to wake (hot) word to control the app and listening mode.
 */

function loadWakeWindow() {
  // Only one instance to be open
  if ( isWindowOpen( 'wake' ) ) {
    return;
  }

  windows.wake.instance = new BrowserWindow( windows.wake.options );

  windows.wake.instance.loadURL( composeWindowUrl( windows.wake.fileName, windows.wake.folderName ) );

  ipcMain.on( 'wake-word-recognized', onWakeWordRecognized );
  ipcMain.on( 'notify-wake-by-hotword-status', onNotifyWakeByHotwordStatus );
}

/**
 * Load window that explains what the app is and what to do.
 * Create file which will indicate node.exe when to autoquit.
 */

function loadIntroWindow() {
  require( './menu-intro' );

  /**
   * @todo DRY.
   */
  windows.intro.instance = new BrowserWindow( windows.intro.options );

  windows.intro.instance.loadURL( composeWindowUrl( windows.intro.fileName ) );

  windows.intro.instance.on( 'closed', () => {
    windows.intro.instance = null;
  } );
}

/**
 * Load one of the app windows.
 *
 * @param {string} strWindowName - The window to open.
 */

export function loadWindow( strWindowName ) {
  if ( utils.isStringEmpty( strWindowName ) ) {
    return;
  }

  const window = windows[ strWindowName ];

  if ( typeof window === 'undefined' ) {
    return;
  }

  if ( isWindowOpen( strWindowName ) ) {
    window.instance.focus();

    return;
  }

  /**
   * @todo DRY.
   */
  window.instance = new BrowserWindow( window.options );

  window.instance.loadURL( composeWindowUrl( window.fileName ) );
  window.instance.setMenu( null );

  window.instance.on( 'closed', () => {
    window.instance = null;
  } );
}

/**
 * Unload (close and null the reference) one of the app windows.
 *
 * @param {string} strWindowName - The window to close.
 */

function unloadWindow( strWindowName ) {
  if ( utils.isStringEmpty( strWindowName ) ) {
    return;
  }

  const window = windows[ strWindowName ];

  if ( typeof window === 'undefined' ) {
    return;
  }

  if ( isWindowOpen( strWindowName ) ) {
    try {
      window.instance.close();
    }
    catch( e ) {}

    window.instance = null;
  }

  if ( strWindowName === 'wake' ) {
    ipcMain.removeListener( 'wake-word-recognized', onWakeWordRecognized );
    ipcMain.removeListener( 'notify-wake-by-hotword-status', onNotifyWakeByHotwordStatus );
  }
}

/**
 * Check whether the window is open (loaded and referenced).
 *
 * @todo Add successCallback and errorCallback.
 *
 * @param {string} strWindowName - The window to check.
 * @return {Boolean}
 */

export function isWindowOpen( strWindowName ) {
  if ( utils.isStringEmpty( strWindowName ) ) {
    return false;
  }

  const window = windows[ strWindowName ];

  if ( typeof window === 'undefined' ) {
    return false;
  }

  return window.instance !== null;
}

/**
 * If the menu option is to affect the index window contents, send it a message.
 *
 * @param {string} strChannel
 * @param {...*} [args]
 */

export function sendMessageToIndexWindow( strChannel, ...args ) {
  windows.index.instance.webContents.send( strChannel, ...args );
}

/**
 * Asynchronously check whether native messaging helper process is running.
 */

function checkHelperProcess() {
  let win = new BrowserWindow( windows.checkProcessRunning.options );

  win.loadURL( composeWindowUrl( windows.checkProcessRunning.fileName, windows.checkProcessRunning.folderName ) );

  win.webContents.on( 'did-finish-load', () => {
    win.webContents.send( 'check-process-running' );
  } );

  ipcMain.on( 'check-process-running-complete', onCheckProcessRunningComplete );
}

/**
 * Check is complete, act on the result.
 *
 * @param {Object} objEvent - The event object.
 * @param {Boolean} boolIsRunning - Whether the helper process is running or not.
 */

function onCheckProcessRunningComplete( objEvent, boolIsRunning ) {
  if ( typeof boolIsRunning === 'boolean' && ! boolIsRunning ) {
    loadWindow( 'activation' );

    const indexWindowInstance = windows.index.instance;

    if ( indexWindowInstance !== null ) {
      indexWindowInstance.webContents.send( 'notify-no-activation' );
    }
  }

  ipcMain.removeListener( 'check-process-running-complete', onCheckProcessRunningComplete );
}

/**
 * Wake word got recognized, proceed.
 *
 * @param {Object} objEvent - The event object.
 * @param {Boolean} boolIsRecognized - Whether the wake word is recognized or not.
 */

function onWakeWordRecognized( objEvent, boolIsRecognized ) {
  boolIsRecognized = typeof boolIsRecognized === 'boolean' && boolIsRecognized;

  if ( boolIsRecognized ) {
    if ( windows.index.instance ) {

      if ( shouldWakeListeningModeByHotword() ) {
        windows.index.instance.webContents.send( 'wake-listening-mode' );
      }

      if ( shouldWakeAppByHotword() ) {
        if ( ! windows.index.instance.isVisible() || windows.index.instance.isMinimized() || ! windows.index.instance.isFocused() ) {
          windows.index.instance.show();
          windows.index.instance.focus();
        }
      }
    }
  }
}

/**
 * When the wake by hotword is ready or getting ready to listen.
 *
 * @param {Object} [objEvent] - The event object.
 * @param {Boolean} [boolIsReady] - Whether the wake by hotword is ready.
 */

function onNotifyWakeByHotwordStatus( objEvent, boolIsReady ) {
  if ( typeof boolIsReady !== 'boolean' ) {
    return;
  }

  config.set( 'boolIsWakeByHotwordGettingReady', ! boolIsReady );
  sendMessageToIndexWindow( 'notify-wake-by-hotword-status', boolIsReady )
}

/**
 * Close the intro window after the approvals received.
 */

function closeIntroWindow() {
  windows.intro.instance.close();
}

/**
 * Create a BrowserWindow URL string for the specified file.
 *
 * @param {string} strFileName - The file name without file extension.
 * @param {string} [strFolderName] - The folder name the file is located in.
 * @return {string}
 */

function composeWindowUrl( strFileName, strFolderName = strFileName ) {
  if ( checkNameValidity( strFileName ) && checkNameValidity( strFolderName ) ) {
    return `file://${ app.getAppPath() }/src/renderers/${ strFolderName }/${ strFileName }.html`;
  }
  else {
    throw new Error( 'Elf: invalid window URL parameters' );
  }
}

/**
 * Check the file or folder name is not an empty string,
 * starts with an alphanumeric character,
 * and consists of alphanumeric and "-" and/or "_" characters.
 *
 * @param {string} strName - The file or folder name to check.
 * @return {Boolean}
 */

function checkNameValidity( strName ) {
  return strName &&
    ! utils.isStringEmpty( strName ) &&
    /**
     * @todo Improve RegEx to not have repeated "-" and/or "_".
     */
    /^[a-z0-9]+([a-z0-9-_]{1})+(?!.*\s)+(.*[a-z0-9])?$/.test( strName );
}

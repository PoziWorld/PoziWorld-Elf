/**
 * @file Sends commands received by Elf to the partner browser extensions.
 * @copyright 2016-2017 PoziWorld, Inc.
 */

// stdio

const fs = require( 'fs' );
const chokidar = require( 'chokidar' );
import { fileNames } from '../shared/file-names.js';

let output;

setNativeMessagingHandler();
startGui();
setMessagingWatcher();
setAppStateWatcher();

/**
 * @copyright Borrowed from https://github.com/jdiamond/chrome-native-messaging
 */

function setNativeMessagingHandler() {
  const nativeMessage = require( './elf-stdio.js' );
  const input = new nativeMessage.Input();
  const transform = new nativeMessage.Transform( messageHandler );
  output = new nativeMessage.Output();

  process.stdin
    .pipe( input )
    .pipe( transform )
    .pipe( output )
    .pipe( process.stdout )
    ;
}

/**
 * Launch the Elf GUI (voice control app itself).
 */

function startGui() {
  const spawn = require( 'child_process' ).spawn;
  /**
   * @todo Filename to be grabbed from package.json.
   */
  const elf = spawn( 'PoziWorld Elf.exe' );
}

/**
 * File watcher helper used for communication between extensions and Elf.
 */

function setMessagingWatcher() {
  setWatcher( fileNames.messaging, onMessage );
}

/**
 * Kill native messaging handler when the GUI is shutdown.
 */

function setAppStateWatcher() {
  setWatcher( fileNames.appState, onAppStateChange );
}

/**
 *
 * @param strFileName
 * @param funcCallback
 */

function setWatcher( strFileName, funcCallback ) {
  if ( isStringEmpty( strFileName ) && ! isFunction() ) {
    return;
  }

  chokidar.watch( strFileName, { ignoreInitial: true } )
    .on( 'add', funcCallback )
    .on( 'change', funcCallback )
    ;
}

/**
 *
 * @param strPath
 * @param objStats
 */

function onMessage( strPath, objStats ) {
  if ( typeof objStats !== 'object' ) {
    return;
  }

  fs.readFile( './' + fileNames.messaging, 'utf8', function ( err, strMessage ) {
    if ( err ) {
      throw err;
    }

    if ( ! isStringEmpty( strMessage ) && isDefined( output ) ) {
      try {
        output.write( { 'objVoiceControlMessage': JSON.parse( strMessage ) } );
      }
      catch( e ) {}
    }
  } );
}

/**
 *
 * @param strPath
 * @param objStats
 */

function onAppStateChange( strPath, objStats ) {
  fs.readFile( './' + fileNames.appState, 'utf8', function( err, strAppState ) {
    if ( err ) {
      throw err;
    }

    if ( ! isStringEmpty( strAppState ) && isDefined( output ) ) {
      try {
        output.write( { 'strVoiceControlAppState' : strAppState } );
      }
      catch( e ) {}
    }

    if ( strAppState === 'window-all-closed' ) {
      process.exit();
    }
  } );
}

/**
 *
 * @param msg
 * @param push
 * @param done
 */

function messageHandler( msg, push, done ) {
  // Just echo the message
  push( msg );
  done();
}

/**
 * @todo Switch to Object.prototype.toString.call( VAR ).slice( 8, -1 ).
 */

/**
 * Check whether it's a string and it's empty (zero length).
 *
 * @param {string} str - The string to check.
 * @return {Boolean}
 */

function isStringEmpty( str ) {
  return typeof str === 'string' && str === '';
}

/**
 * Check whether it's an object (not an array) and it's empty (no properties).
 *
 * @param {Object} obj - The object to check.
 * @return {Boolean}
 */

function isObjectEmpty( obj ) {
  return typeof obj === 'object' && ! Array.isArray( obj ) && Object.keys( obj ).length === 0;
}

/**
 * Check whether it's a function.
 *
 * @param {Function} func - The function to check.
 * @return {Boolean}
 */

function isFunction( func ) {
  return typeof func === 'function';
}

/**
 * Check whether it defined.
 *
 * @param {*} variable - The variable to check.
 * @return {Boolean}
 */

function isDefined( variable ) {
  return typeof variable !== 'undefined';
}

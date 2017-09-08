import { ipcRenderer } from 'electron';

ipcRenderer.on( 'check-process-running', onCheckProcessRunning );

/**
 * Check whether the helper process is running or not.
 */

function onCheckProcessRunning() {
  ps.lookup( { command: 'elf-node' }, ( err, arrResultList ) => {
    if ( err ) {
      throw new Error( err );
    }

    if ( ! arrResultList.length ) {
      reportNotRunning();
    }

    arrResultList.forEach( ( process ) => {
      if ( process ) {
        reportRunning();
      }
      else {
        reportNotRunning();
      }
    } );
  } );
}

/**
 * Send a message to the main process that the helper is running.
 */

function reportRunning() {
  report( true );
}

/**
 * Send a message to the main process that the helper isn't running.
 */

function reportNotRunning() {
  report( false );
}

/**
 * Send a message to the main process that the helper is or isn't running.
 *
 * @param {Boolean} boolIsRunning - Whether the helper process is running or not.
 */

function report( boolIsRunning ) {
  if ( typeof boolIsRunning === 'boolean' ) {
    ipcRenderer.send( 'check-process-running-complete', boolIsRunning );
    window.close();
  }
}

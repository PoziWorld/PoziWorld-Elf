let recognizer;
let recorder;
let callbackManager;
let audioContext;
let outputContainer;
let lastCount;

let isRecorderReady = false;
let isRecognizerReady = false;

// The list of words that need to be added to the recognizer
// Follows the CMU dictionary format
const wordList = [
  [
    'OKEY-DOKEY',
    'OW K IY D OW K IY',
  ],
];

const keywords = [
  {
    title : 'OKEY-DOKEY',
    g : 'OKEY-DOKEY',
  },
];

let keywordIds = [];

notifyWakeByHotwordStatus( false );

/**
 * Notify the status of the wake by hotword (ready or getting ready).
 *
 * @param {Boolean} [boolIsReady] - Whether the wake by hotword is ready.
 */

function notifyWakeByHotwordStatus( boolIsReady ) {
  ipc.send( 'notify-wake-by-hotword-status', boolIsReady );
}

/**
 * Post a message to the recognizer and associate a callback to its response
 */

function postRecognizerJob( message = {}, callback ) {
  if ( callbackManager ) {
    message.callbackId = callbackManager.add( callback );
  }

  if ( recognizer ) {
    recognizer.postMessage( message );
  }
}

/**
 * Initializes an instance of the recorder.
 * Posts a message right away and calls onReady when it is ready so that onmessage can be properly set.
  */

function spawnWorker( workerURL, onReady ) {
  recognizer = new Worker( workerURL );

  recognizer.onmessage = ( event ) => {
    onReady( recognizer );
  };

  recognizer.postMessage( '' );
}

/**
 * Display the hypothesis sent by the recognizer.
 */

function updateCount( count ) {
  if ( outputContainer && count !== lastCount ) {
    outputContainer.textContent = count;
    lastCount = count;

    // False positive
    if ( count !== '' ) {
      ipc.send( 'wake-word-recognized', true );
    }
  }
}

/**
 * Update the UI when the app might get ready
 */

function updateUI() {
  if ( isRecorderReady && isRecognizerReady ) {
    startBtn.disabled = stopBtn.disabled = false;
  }
}

/**
 * Append new status to the log.
 */

function updateStatus( newStatus ) {
  document.getElementById( 'current-status' ).innerHTML += '<br>' + newStatus;
}

/**
 * Indicate whether it is recording.
 */

function displayRecording( display ) {
  document.getElementById( 'recording-indicator' ).hidden = ! display;
  notifyWakeByHotwordStatus( display );
}

/**
 * Once the user authorises access to the microphone, instantiate the recorder.
  */

function startUserMedia( stream ) {
  const input = audioContext.createMediaStreamSource( stream );

  // Firefox hack https://support.mozilla.org/en-US/questions/984179
  window.firefox_audio_hack = input;

  const audioRecorderConfig = {
    errorCallback : ( x ) => {
      updateStatus( 'Error from recorder: ' + x );
    }
  };

  recorder = new AudioRecorder( input, audioRecorderConfig );

  if ( recognizer ) {
    recorder.consumers = [ recognizer ];
  }

  isRecorderReady = true;
  updateUI();
  updateStatus( 'Audio recorder ready' );
}

/**
 * Go!
 */

const startRecording = () => {
  const id = document.getElementById( 'keyword' ).value;

  if ( recorder && recorder.start( id ) ) {
    displayRecording( true );
  }
};

/**
 * Stop recording.
 */

const stopRecording = () => {
  recorder && recorder.stop();
  displayRecording( false );
};

/**
 * Once the recognizer is ready, add the grammars to the input select tag and update the UI.
 */

const recognizerReady = () => {
  updateKeywords();
  isRecognizerReady = true;
  updateUI();
  updateStatus( 'Recognizer ready' );
  startRecording();
};

/**
 * Get the grammars and fill in the input select tag
 */

const updateKeywords = () => {
  const selectTag = document.getElementById( 'keyword' );

  for ( let i = 0, l = keywordIds.length; i < l; i++ ) {
    const newElt = document.createElement( 'option' );
    const keyword = keywordIds[ i ];

    newElt.value = keyword.id;
    newElt.innerHTML = keyword.title;

    selectTag.appendChild( newElt );
  }
};

/**
 * Add a keyword search from the array one by one and call it again as a callback.
 * Once done adding all grammars, call recognizerReady().
 */

const feedKeyword = ( g, index, id ) => {
  if ( id && ( keywordIds.length > 0 ) ) {
    keywordIds[ 0 ].id = id.id;
  }

  if ( index < g.length ) {
    keywordIds.unshift( { title : g[ index ].title } );

    postRecognizerJob(
      { command : 'addKeyword', data : g[ index ].g },
      ( id ) => {
        feedKeyword( keywords, index + 1, { id : id } );
      }
    );
  }
  else {
    recognizerReady();
  }
};

/**
 * Add to the recognizer. When it calls back, add grammars.
 */

const feedWords = ( words ) => {
  postRecognizerJob(
    { command : 'addWords', data : words },
    () => {
      feedKeyword( keywords, 0 );
    }
  );
};

/**
 * Initialize the recognizer. When it calls back, add words.
 */

const initRecognizer = () => {
  postRecognizerJob(
    { command : 'initialize', data : [ [ '-kws_threshold', '1e-35' ] ] },
    () => {
      if ( recorder ) {
        recorder.consumers = [ recognizer ];
      }

      feedWords( wordList );
    }
  );
};

/**
 * When the page is loaded, spawn a new recognizer worker and call getUserMedia to request access to the microphone.
 */

window.onload = function () {
  outputContainer = document.getElementById( 'output' );

  updateStatus( 'Initializing web audio and speech recognizer, waiting for approval to access the microphone' );

  callbackManager = new CallbackManager();

  spawnWorker(
    'js/recognizer.js',
    ( worker ) => {
      // Once the worker is fully loaded
      worker.onmessage = ( e ) => {
        // When there is a callback ID to be called
        if ( e.data.hasOwnProperty( 'id' ) ) {
          const clb = callbackManager.get( e.data[ 'id' ] );
          let data = {};

          if ( e.data.hasOwnProperty( 'data' ) ) {
            data = e.data.data;
          }

          if ( clb ) {
            clb( data );
          }
        }

        // When the recognizer has a new count number
        if ( e.data.hasOwnProperty( 'hyp' ) ) {
          let newCount = e.data.hyp;

          if ( e.data.hasOwnProperty( 'final' ) && e.data.final ) {
            newCount = 'Final: ' + newCount;
          }

          updateCount( newCount );
        }

        // There is an error
        if ( e.data.hasOwnProperty( 'status' ) && ( e.data.status == 'error' ) ) {
          updateStatus( 'Error in ' + e.data.command + ' with code ' + e.data.code );
        }
      };

      // Once the worker is fully loaded, call the initialize function
      initRecognizer();
    }
  );

  // Initialize Web Audio
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audioContext = new AudioContext();
  }
  catch ( e ) {
    updateStatus( 'Error initializing Web Audio browser' );
  }

  if ( navigator.getUserMedia ) {
    navigator.getUserMedia(
      { audio : true },
      startUserMedia,
      ( e ) => {
        updateStatus( 'No live audio input in this browser' );
      }
    );
  }
  else {
    updateStatus( 'No web audio support in this browser' );
  }

  // Wiring JavaScript to the UI
  const startBtn = document.getElementById( 'startBtn' );
  const stopBtn = document.getElementById( 'stopBtn' );

  startBtn.disabled = true;
  stopBtn.disabled = true;

  startBtn.onclick = startRecording;
  stopBtn.onclick = stopRecording;
};

const loadedStates = [ 'complete', 'loaded', 'interactive' ];

if ( loadedStates.includes( document.readyState ) && document.body ) {
  startRecording();
}
else {
  window.addEventListener( 'DOMContentLoaded', startRecording, false );
}

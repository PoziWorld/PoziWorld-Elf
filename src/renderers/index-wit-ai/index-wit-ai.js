import React from 'react';
import ReactDOM from 'react-dom';

import Microphone from './Microphone';

function run() {
  ReactDOM.render(
    <Microphone />,
    document.getElementById( 'root' )
  );
}

const loadedStates = [ 'complete', 'loaded', 'interactive' ];

if ( loadedStates.includes( document.readyState ) && document.body ) {
  run();
}
else {
  window.addEventListener( 'DOMContentLoaded', run, false );
}

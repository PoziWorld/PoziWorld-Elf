let recBuffers = [];
let outputSampleRate = 16000;
let inSampleRate;

this.onmessage = ( e ) => {
  switch ( e.data.command ) {
    case 'init':
      init( e.data.config );
      break;
    case 'record':
      record( e.data.buffer );
      break;
    case 'clear':
      clear();
      break;
  }
};

function init( config ) {
  inSampleRate = config.sampleRate;
  outputBufferLength = config.outputBufferLength;
  outputSampleRate = config.outputSampleRate || outputSampleRate;
}

function record( inputBuffer ) {
  let isSilent = true;

  for ( let i = 0, l = inputBuffer[ 0 ].length; i < l; i++ ) {
    recBuffers.push( ( inputBuffer[ 0 ][ i ] + inputBuffer[ 1 ][ i ] ) * 16383.0 );
  }

  while ( recBuffers.length * outputSampleRate / inSampleRate > outputBufferLength ) {
    let result = new Int16Array( outputBufferLength );
    let bin = 0;
    let num = 0;
    let indexIn = 0;
    let indexOut = 0;

    while ( indexIn < outputBufferLength ) {
      bin = 0;
      num = 0;

      while ( indexOut < Math.min( recBuffers.length, ( indexIn + 1 ) * inSampleRate / outputSampleRate ) ) {
        bin += recBuffers[ indexOut ];
        num += 1;
        indexOut++;
      }

      result[ indexIn ] = bin / num;

      if ( isSilent && ( result[ indexIn ] != 0 ) ) {
        isSilent = false;
      }

      indexIn++;
    }

    const output = {};

    output.command = 'newBuffer';
    output.data = result;

    if ( isSilent ) {
      output.error = 'silent';
    }

    this.postMessage( output );
    recBuffers = recBuffers.slice( indexOut );
  }
}

function clear() {
  recBuffers = [];
}

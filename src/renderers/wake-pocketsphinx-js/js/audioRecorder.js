( ( window ) => {
    const AUDIO_RECORDER_WORKER = 'js/audioRecorderWorker.js';

    function AudioRecorder( source, config = {} ) {
      this.consumers = [];

      const errorCallback = config.errorCallback || ( () => {} );
      const inputBufferLength = config.inputBufferLength || 4096;
      const outputBufferLength = config.outputBufferLength || 4000;

      this.context = source.context;
      this.node = this.context.createScriptProcessor( inputBufferLength );

      const worker = new Worker( config.worker || AUDIO_RECORDER_WORKER );

      worker.postMessage( {
        command: 'init',
        config: {
          sampleRate: this.context.sampleRate,
          outputBufferLength: outputBufferLength,
          outputSampleRate: ( config.outputSampleRate || 16000 )
        }
      } );

      let recording = false;

      this.node.onaudioprocess = ( e ) => {
        if ( !recording ) {
          return;
        }

        worker.postMessage( {
          command: 'record',
          buffer : [
            e.inputBuffer.getChannelData( 0 ),
            e.inputBuffer.getChannelData( 1 )
          ]
        } );
      };

      this.start = ( data ) => {
        this.consumers.forEach( ( consumer, y, z ) => {
          consumer.postMessage( { command : 'start', data : data } );
          recording = true;

          return true;
        } );

        recording = true;

        return ( this.consumers.length > 0 );
      };

      this.stop = () => {
        if ( recording ) {
          this.consumers.forEach( ( consumer, y, z ) => {
            consumer.postMessage( { command : 'stop' } );
          } );

          recording = false;
        }

        worker.postMessage( { command : 'clear' } );
      };

      this.cancel = () => {
        this.stop();
      };

      myClosure = this;

      worker.onmessage = ( e ) =>{
        if ( e.data.error && ( e.data.error == 'silent' ) ) {
          errorCallback( 'silent' );
        }

        if ( ( e.data.command == 'newBuffer' ) && recording ) {
          myClosure.consumers.forEach( ( consumer, y, z ) => {
            consumer.postMessage( {
              command : 'process',
              data : e.data.data
            } );
          } );
        }
      };

      source.connect( this.node );
      this.node.connect( this.context.destination );
    }

    window.AudioRecorder = AudioRecorder;
  }
)( window );

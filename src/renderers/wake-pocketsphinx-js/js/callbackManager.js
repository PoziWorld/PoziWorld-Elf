( ( window ) => {
  function CallbackManager() {
    let currentId = 0;
    const callbackPool = {};

    this.add = function ( clb ) {
      const id = currentId;
      callbackPool[ id ] = clb;
      currentId++;

      return id;
    };

    this.get = function ( id ) {
      if ( callbackPool.hasOwnProperty( id ) ) {
        const clb = callbackPool[ id ];
        delete callbackPool[ id ];

        return clb;
      }

      return null;
    };
  }

  window.CallbackManager = CallbackManager;
} )( window );

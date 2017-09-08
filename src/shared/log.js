/** Abstract console.log for additional output data. */

class Log {

  /**
   * Add a record to the log.
   *
   * @todo Replace with electron-log?
   *
   * @param {string} strName - Name of the log record.
   * @param {*} [params] - Corresponding parameters of the record.
   */

  add( strName, ...params ) {
    console.log( this.getDateTime(), strName, params );
  }

  /**
   * Return a string with current date and time in a sort-friendly format.
   *
   * @returns {string}
   *
   * @example
   * // returns '2015-10-21-16-29-03-265'
   * getDateTime();
   */

  getDateTime() {
    const date = new Date();
    const intMonth = date.getMonth() + 1;
    const intDate = date.getDate();
    const intHours = date.getHours();
    const intMinutes = date.getMinutes();
    const intSeconds = date.getSeconds();
    const intMilliseconds = date.getMilliseconds();
    const prependWithZeros = this.prependWithZeros;

    return date.getFullYear() + '-' +
      prependWithZeros( intMonth ) + '-' +
      prependWithZeros( intDate ) + '-' +
      prependWithZeros( intHours ) + '-' +
      prependWithZeros( intMinutes ) + '-' +
      prependWithZeros( intSeconds ) + '-' +
      prependWithZeros( intMilliseconds, true );
  }

  /**
   * Prepend numbers with additional zeros, so that the returned string is always the same length for this parameter.
   * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
   *
   * @param {Number} intNumber - Number to prepend.
   * @param {Boolean} [boolIsThreeCharacters] - Whether the return string length should be 3.
   * @returns {string}
   *
   * @example
   * // returns '007'
   * prependWithZeros( 7, true );
   *
   * @example
   * // returns '08'
   * prependWithZeros( 8 );
   *
   * @todo Figure out why static prependWithZeros doesn't work
   */

  prependWithZeros( intNumber, boolIsThreeCharacters = false ) {
    if ( boolIsThreeCharacters ) {
      return intNumber < 10 ? '0' + intNumber : ( intNumber < 100 ? '0' + intNumber : intNumber );
    }

    return intNumber < 10 ? '0' + intNumber : intNumber;
  }
}

const log = new Log();

export default log;

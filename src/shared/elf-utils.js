/**
 * @todo Switch to Object.prototype.toString.call( VAR ).slice( 8, -1 ).
 */

/**
 * Check whether it's a string and it's empty (zero length).
 *
 * @param {string} str - The string to check.
 * @return {Boolean}
 */

export function isStringEmpty( str ) {
  if ( typeof str === 'string' ) {
    return ( str === '' );
  }
  else {
    throw new TypeError( 'Elf: not a string' );
  }
}

/**
 * Check whether it's an object (not an array) and it's empty (no properties).
 *
 * @param {Object} obj - The object to check.
 * @return {Boolean}
 */

export function isObjectEmpty( obj ) {
  if ( typeof obj === 'object' && ! Array.isArray( obj ) ) {
    return Object.keys( obj ).length === 0;
  }
  else {
    throw new TypeError( 'Elf: not an object' );
  }
}

/**
 * Check whether it's a function.
 *
 * @param {Function} func - The function to check.
 * @return {Boolean}
 */

export function isFunction( func ) {
  return typeof func === 'function';
}

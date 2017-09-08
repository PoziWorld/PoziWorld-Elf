import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import config from './config';

const arrHtmlClassList = document.documentElement.classList;

/**
 * Apply dark colors theme to the view.
 */

export function useDarkTheme() {
  if ( config.get( 'boolUseDarkTheme' ) ) {
    arrHtmlClassList.add( 'dark' );
  }
}

/**
 * Listen to when the "Use dark theme" toggle gets switched in the menu.
 */

export function addDarkThemeToggleEventListener() {
  ipcRenderer.on( 'use-dark-theme', ( objEvent, boolUse ) => {
    if ( typeof boolUse === 'boolean' ) {
      arrHtmlClassList.toggle( 'dark', boolUse );
    }
  } );
}

/**
 * Apply styles aimed for users who use keyboard to navigate the view.
 */

export function enableKeyboardNavigationStyles() {
  if ( config.get( 'boolEnableKeyboardNavigationStyles' ) ) {
    arrHtmlClassList.add( 'keyboard' );
  }
}

/**
 * Listen to when the "Enable styles optimized for keyboard navigation" toggle gets switched in the menu.
 */

export function addKeyboardNavigationStylesToggleEventListener() {
  ipcRenderer.on( 'enable-keyboard-navigation-styles', ( objEvent, boolEnable ) => {
    if ( typeof boolEnable === 'boolean' ) {
      arrHtmlClassList.toggle( 'keyboard', boolEnable );
    }
  } );
}

/**
 *
 * @param ReactComponent
 * @param i18n
 */

export function renderOnReady( ReactComponent, i18n ) {
  if ( ! ReactComponent ) {
    return;
  }

  const loadedStates = [ 'complete', 'loaded', 'interactive' ];

  if ( loadedStates.includes( document.readyState ) && document.body ) {
    render( ReactComponent, i18n );
  }
  else {
    window.addEventListener( 'DOMContentLoaded', () => {
      render( ReactComponent, i18n );
    }, false );
  }
}

/**
 *
 * @param ReactComponent
 * @param i18n
 */

function render( ReactComponent, i18n ) {
  if ( ! ReactComponent ) {
    return;
  }

  ReactDOM.render(
    <I18nextProvider i18n={ i18n }><ReactComponent /></I18nextProvider>,
    document.getElementById( 'root' )
  );
}

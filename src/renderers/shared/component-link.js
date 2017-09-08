import { ipcRenderer } from 'electron';
import React from 'react';

import log from '../../shared/log';
import * as utils from '../../shared/elf-utils';
import { linkContextMenu } from './menu-context-link';

export default class Link extends React.Component {
  constructor( props ) {
    super( props );
  }

  handleClick = ( e ) => {
    e.preventDefault();

    log.add( 'Elf: click Link', this );

    const objData = e.currentTarget.dataset;

    ipcRenderer.send( 'save-link-data', {
      strUrl: objData.href,
      strLink: objData.link
    } );

    linkContextMenu.popup();
  };

  render() {
    const objProps = this.props;

    return (
      <a
        href={ objProps.href }
        data-href={ objProps.href }
        data-link={ objProps[ 'data-link' ] }
        className="pwLink"
        onClick={ this.handleClick }
        title={ objProps.title }
          >{ objProps.content }</a>
    );
  }
}

/**
 * Create a link with the provided properties.
 *
 * @param {I18n} i18n - Initialized i18n instance.
 * @param {string} strContent - The link inner/child.
 * @param {string} [strTitle] - The link title attribute.
 * @param {string} [strHref] - The link href attribute.
 * @return {HTML}
 */

export function createLink( { i18n, strContent, strTitle, strHref } ) {
  if ( utils.isStringEmpty( strContent ) ) {
    return;
  }

  // A translation string consists of the actual link ID/name + "Link" in the end
  const strLink = strContent.substr( 0, strContent.length - 'Link'.length );

  return <Link
      href={ ( strHref && ! utils.isStringEmpty( strHref ) ? strHref : '#' ) }
      title={ ( strTitle && ! utils.isStringEmpty( strTitle ) ? i18n.t( strTitle ) : '' ) }
      data-link={ strLink }
      content={ i18n.t( strContent ) }
        />;
}

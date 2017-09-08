import { ipcRenderer } from 'electron';
import React from 'react';
import { translate, Interpolate } from 'react-i18next';

import I18n from '../../shared/I18n';
import log from '../../shared/log';
import { addDarkThemeToggleEventListener } from '../../shared/view';
import { createLink } from '../shared/component-link';

import './intro.css';

const arrI18nNamespaces = [ 'renderer-intro' ];
export const i18n = new I18n( arrI18nNamespaces );

class Intro extends React.Component {
  constructor( props ) {
    super( props );
  }

  componentDidMount() {
    addDarkThemeToggleEventListener();
  }

  handleClick = ( e ) => {
    log.add( 'Elf: click Next', this );

    const $button = e.target;

    $button.disabled = true;

    ipcRenderer.on( 'intro-next-reply', ( objEvent, strReply ) => {
      log.add( 'Elf: click Next: reply', arguments );

      if ( typeof strReply === 'string' && strReply !== '' ) {
        if ( strReply === 'error' ) {
          $button.disabled = false;
        }
      }
    } );

    ipcRenderer.send( 'on-intro-user-action' );
  };

  render() {
    /**
     * @todo <hr /> to CSS
     */

    return (
      <div id="intro">
        <h3>
          { i18n.t( 'tlDr' ) }
        </h3>
        <hr />
        <section>
          <p>
            { i18n.t( 'description' ) }
          </p>
          <Interpolate
            i18nKey="supportedCommands"
            parent="p"
            commandsListLink={ createLink( {
              i18n,
              strContent: 'commandsListLink',
              strTitle: 'seeAvailableCommandsList',
            } ) }
              />
        </section>
        <hr />
        <section>
          <Interpolate
            i18nKey="requirements"
            parent="p"
            chromeBrowserLink={ createLink( {
              i18n,
              strContent: 'chromeBrowserLink',
              strHref: 'https://www.google.com/chrome/browser/desktop/',
            } ) }
            operaBrowserLink={ createLink( {
              i18n,
              strContent: 'operaBrowserLink',
              strHref: 'https://www.opera.com/computer',
            } ) }
            partnersListLink={ createLink( {
              i18n,
              strContent: 'partnersListLink',
              strTitle: 'seeAvailablePartnersList',
            } ) }
              />
          <p>
            { i18n.t( 'howItSendsCommands' ) }
          </p>
          <p>
            { i18n.t( 'whatToDo' ) }
            <br />
            <Interpolate
              i18nKey="details"
              parent="small"
              detailsLink={ createLink( {
                i18n,
                strContent: 'detailsLink',
                strHref: 'https://developer.chrome.com/extensions/nativeMessaging',
              } ) }
                />
          </p>
        </section>
        <hr />
        <section>
          <Interpolate
            i18nKey="userAgreement"
            parent="p"
            nextCtaText={ i18n.t( 'nextCtaText' ) }
            termsLink={ createLink( {
              i18n,
              strContent: 'termsLink',
            } ) }
            privacyPolicyLink={ createLink( {
              i18n,
              strContent: 'privacyPolicyLink',
            } ) }
              />
        </section>
        <button
          className="pwCta"
          onClick={ this.handleClick }
            >
          <Interpolate
            i18nKey="nextCta"
            nextCtaText={ i18n.t( 'nextCtaText' ) }
              />
        </button>
      </div>
    );
  }
}

export default translate( arrI18nNamespaces )( Intro );

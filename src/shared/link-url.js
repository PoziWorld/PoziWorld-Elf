import { clipboard, shell } from 'electron';

import * as utils from './elf-utils';

/**
 * Open URL in the default browser (the last active profile/window in case of Chrome).
 *
 * @param {string} [strUrl] - The URL to go to.
 * @param {string} [strLink] - The link ID/name, matches translation key.
 */

export function goToUrl( { strUrl, strLink } ) {
  getUrl( { strUrl, strLink, strAction: 'goToUrl' } );
}

/**
 * Copy URL to clipboard.
 *
 * @param {string} [strUrl] - The URL to go to.
 * @param {string} [strLink] - The link ID/name, matches translation key.
 */

export function copyUrl( { strUrl, strLink } ) {
  getUrl( { strUrl, strLink, strAction: 'copyUrl' } );
}

/**
 * If URL is not provided, retrieve it by name. Then, proceed with the action.
 *
 * @param {string} [strUrl] - The URL to go to.
 * @param {string} [strLink] - The link ID/name, matches translation key.
 * @param {string} strAction - The action to take on the link.
 */

function getUrl( { strUrl, strLink, strAction } ) {
  if ( ! strUrl || utils.isStringEmpty( strUrl ) || strUrl === '#' ) {
    strUrl = getUrlById( strLink );
  }

  if ( strUrl ) {
    if ( strAction === 'copyUrl' ) {
      clipboard.writeText( strUrl );
    }
    else {
      shell.openExternal( strUrl );
    }
  }
}

/**
 * Provide URL ID, get actual URL.
 *
 * @param {string} strLink - The link ID/name, matches translation key.
 * @returns {string|Boolean}
 */

function getUrlById( strLink ) {
  const strUrl = objLinks[ strLink ];

  if ( typeof strUrl === 'string' && strUrl !== '' ) {
    return strUrl;
  }

  return false;
}

const objLinks = {
  'acknowledgements': 'https://pozi.world/projects/elf/acknowledgements/list/',
  'becomePartner': 'https://pozi.world/projects/elf/partners/new/',
  'commandsFaq': 'https://pozi.world/projects/elf/commands/faq/',
  'commandsList': 'https://pozi.world/projects/elf/commands/list/',
  'contribution': 'https://pozi.world/projects/elf/contribution/new/',
  'feedback': 'https://pozi.world/projects/elf/feedback/new/',
  'helpTranslate': 'https://pozi.world/projects/elf/translations/new/',
  'incentive': 'https://pozi.world/projects/elf/incentive/new/',
  'partnersList': 'https://pozi.world/projects/elf/partners/list/',
  'pozitone': 'https://pozitone.com',
  'privacyFaq': 'https://pozi.world/projects/elf/privacy/faq/',
  'privacyPolicy': 'https://pozi.world/projects/elf/privacy/policy/',
  'requestCommandLanguage': 'https://pozi.world/projects/elf/commands/languages/new/',
  'share': 'https://pozi.world/projects/elf/share/new/',
  'terms': 'https://pozi.world/projects/elf/terms/list/',
};

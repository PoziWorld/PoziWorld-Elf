import fs from 'fs';
import { fileNames } from '../../shared/file-names';

export default function sendMessage( strMessage ) {
  fs.writeFileSync( fileNames.messaging, strMessage );
}

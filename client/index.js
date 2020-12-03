/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import codePush from "react-native-code-push";

const options = { 
    updateDialog: false, 
    installMode: codePush.InstallMode.IMMEDIATE, 
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME 
}; 

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
  ])

AppRegistry.registerComponent(appName, () => App
);

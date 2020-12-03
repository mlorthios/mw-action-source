/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
    Platform
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import InitNavigation from './src_2.0/navigation/InitNavigation';
import NavigationService from './src_2.0/navigation/NavigationService';
import VersionCheck from 'react-native-version-check';
import codePush from "react-native-code-push";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './src_2.0/store/config';
import SyncStorage from 'sync-storage';
import { eventEmitter, initialMode } from 'react-native-dark-mode';
import LoadingScreen from './src_2.0/screens/LoadingScreen';
import { API_KEY_HTTP } from 'react-native-dotenv'

console.log('key'+API_KEY_HTTP)

class App extends Component {

  constructor(props) {
    super(props);

    let requiresConsent = false;

    this.state = {
      emailEnabled: false,
      animatingEmailButton: false,
      initialOpenFromPush: 'Did NOT open from push',
      activityWidth: 0,
      width: 0,
      activityMargin: 0,
      buttonColor: Platform.OS == 'ios' ? '#ffffff' : '#d45653',
      jsonDebugText: '',
      privacyButtonTitle: 'Privacy Consent: Not Granted',
      inAppIsPaused: true,
      requirePrivacyConsent: requiresConsent,
      status: 'Vérification des mises à jour',
      receivedBytes: '0',
      totalBytes: '0',
      update_loaded: false,
      update_available: false,
      notification: false,
      themeMode: initialMode
    };

    OneSignal.init('e55c2baa-5529-455b-8da7-9d385b5c4cbc', {
      kOSSettingsKeyAutoPrompt: true,
    });

    OneSignal.setLogLevel(6, 0);

  }

  checkUpdate() {
    fetch("https://api.mwactu.fr/v1/version_check?device="+Platform.OS+"&version="+VersionCheck.getCurrentVersion())
        .then(res => res.json())
        .then(
            (result) => {
              if(result['update'] == 'yes') {
                NavigationService.navigate('Update')
              } else {
                return null;
              }
            },
            (error) => {
              return null;
            }
        );
  }

  changeMode(newMode) {
    /*this.setState({themeMode: newMode});
    const action = { type: "CHANGE_THEMEMODE", value: newMode }
    Store.dispatch(action);*/
  }

  async componentDidMount() {
    eventEmitter.on('currentModeChanged', newMode => {
      this.changeMode(newMode);
  })
    this.checkUpdate();
    var providedConsent = await OneSignal.userProvidedPrivacyConsent();
    this.setState({
      privacyButtonTitle: `Privacy Consent: ${
          providedConsent ? 'Granted' : 'Not Granted'
      }`,
      privacyGranted: providedConsent,
    });

    OneSignal.setLocationShared(true);

    OneSignal.inFocusDisplaying(2);

    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
    this.onEmailRegistrationChange = this.onEmailRegistrationChange.bind(this);
    this.onInAppMessageClicked = this.onInAppMessageClicked.bind(this);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener(
        'emailSubscription',
        this.onEmailRegistrationChange,
    );
    OneSignal.addEventListener(
        'inAppMessageClicked',
        this.onInAppMessageClicked,
    );
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.removeEventListener(
        'emailSubscription',
        this.onEmailRegistrationChange,
    );
    OneSignal.removeEventListener(
        'inAppMessageClicked',
        this.onInAppMessageClicked,
    );
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onEmailRegistrationChange(registration) {
    console.log('onEmailRegistrationChange: ', registration);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);

    this.setState({
      jsonDebugText: 'RECEIVED: \n' + JSON.stringify(notification, null, 2),
    });
  }

  onOpened(openResult) {
    if(openResult.notification.payload.additionalData['screen'] == 'NewDetail') {
      this.setState({notification: true});
      NavigationService.navigate('NewsDetail', { idNews: openResult.notification.payload.additionalData['id'], notification: true });
    }
    this.setState({
      jsonDebugText:
          'OPENED: \n' + JSON.stringify(openResult.notification, null, 2),
    });
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  onInAppMessageClicked(actionResult) {
    console.log('actionResult: ', actionResult);
    this.setState({
      jsonDebugText: 'CLICKED: \n' + JSON.stringify(actionResult, null, 2),
    });
  }

  codePushStatusDidChange(status) {
    switch(status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.setState({status: 'Vérification des mises à jour'});
            break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({status: 'Téléchargement des packages'});
            break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({status: 'Installation en cours'});
            break;
        case codePush.SyncStatus.UP_TO_DATE:
            this.setState({status: 'Vous êtes à jour'});
            if(this.state.notification == false) {
              NavigationService.navigate('HomeInit')
            }
            break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
            this.setState({status: 'Mise à jour installé'});
            break;
    }
}

codePushDownloadDidProgress(progress) {
  this.setState({receivedBytes: progress.receivedBytes, totalBytes: progress.totalBytes})
}

render() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InitNavigation screenProps={{themeMode: this.state.themeMode, receivedBytes: this.state.receivedBytes, totalBytes: this.state.totalBytes, status: this.state.status, }} ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
      </PersistGate>
    </Provider>
  )

}

};

const options = { 
  updateDialog: false, 
  installMode: codePush.InstallMode.IMMEDIATE, 
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME 
};


export default codePush(options)(App);
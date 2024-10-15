import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './Context/AppContext';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';import Main from './Main';
import * as Application from 'expo-application';

let uniqueId = Application.getAndroidId();
console.log(uniqueId);

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
      StatusBar.setHidden(false);
    }
    StatusBar.setHidden(true);

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Main uniqueId={uniqueId} />
        <StatusBar hidden={true} />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

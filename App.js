import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './Context/AppContext';
import * as SplashScreen from 'expo-splash-screen';
import Main from './Main';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Main />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
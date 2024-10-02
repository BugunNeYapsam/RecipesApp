import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './Context/AppContext';
import Main from './Main';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Main />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
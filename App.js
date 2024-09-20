import React from 'react';
import { AppProvider } from './Context/AppContext';
import Main from './Main';

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
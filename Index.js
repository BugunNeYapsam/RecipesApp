import * as React from 'react';
import { AppProvider } from './Context/AppContext';
import App from './App';

export default function Index() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );    
}
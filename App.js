import React from 'react';
import { AppProvider } from './Context/AppContext'; // Adjust path
import Main from './Main'; // Adjust path

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
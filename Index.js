import React from 'react';
import { AppProvider } from './Context/AppContext'; // Adjust path
import App from './App'; // Adjust path

console.log('Index.js is being executed');
export default function Index() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
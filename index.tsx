import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Fix: In some versions of MUI Joy, the `defaultMode` prop is named `defaultColorScheme`. */}
    <CssVarsProvider defaultColorScheme="dark">
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);

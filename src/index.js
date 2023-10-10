import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from '@shopify/polaris';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider i18n={enTranslations}>
    <App />
  </AppProvider>,
  document.querySelector('#app'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { store, persistor } from './redux/store';
import './index.css';

// Check for browserslist update only in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Dynamic import to prevent build errors
    import('update-browserslist-db').then(({ default: updateBrowsersList }) => {
      updateBrowsersList();
      console.log('Browserslist database updated successfully');
    }).catch(() => {
      console.log('Skipping browserslist update');
    });
  } catch (e) {
    console.log('Skipping browserslist update');
  }
}

const rootElement = document.getElementById('root') as HTMLElement;

// Pre-rendered content needs to be hydrated, not rendered
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
} else {
  // Regular client-side rendering if not pre-rendered
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

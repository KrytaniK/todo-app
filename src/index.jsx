import React from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import {router} from './Router';
import './styles.css';

// Service Worker Installation
if ("serviceWorker" in navigator && false) {
  navigator.serviceWorker.register("/sw.js");
}

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)

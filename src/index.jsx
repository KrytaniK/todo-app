import React from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import {router} from './Router';
import './styles.css';
import Database from './utils/indexedDB';
import { Status } from './utils/schemas';

if (!JSON.parse(localStorage.getItem('isFirstLoad'))) {
  const db = new Database('todo');
  db.store('statuses').add(new Status({ name: 'Waiting', color: 'white', isTemplate: true }));
  db.store('statuses').add(new Status({ name: 'In Progress', color: 'white', isTemplate: true }));
  db.store('statuses').add(new Status({ name: 'Done', color: 'white', isTemplate: true }));
  localStorage.setItem('isFirstLoad', true);
}

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // {/* </React.StrictMode>, */}
)

import React from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import {router} from './Router';
import './styles.css';
import Database from './utils/indexedDB';
import { Status } from './utils/schemas';

if (!JSON.parse(localStorage.getItem('isFirstLoad'))) {
  const db = new Database('todo');
  db.store('statuses').add(new Status({ id: '1', name: 'Waiting', color: '#ffffff', isTemplate: true }));
  db.store('statuses').add(new Status({ id: '2', name: 'In Progress', color: '#ffffff', isTemplate: true }));
  db.store('statuses').add(new Status({ id: '3', name: 'Done', color: '#ffffff', isTemplate: true }));
  localStorage.setItem('isFirstLoad', true);
}

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)

import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import App from './App';
import { P_Project } from "./pages";
import Database from './utils/indexedDB';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        loader: async () => {

            const db = new Database('todo');
            const projects = await db.store('projects').getAll();

            return { projects };
        },
        children: [
            {
                path: '/projects/:id',
                element: <P_Project/>,
                loader: async ({params}) => {
                    const { id } = params;

                    const db = new Database('todo');
                    const project = await db.store('projects').get(Number(id));

                    if (!project) return redirect('/');
                    
                    return {
                        project: project
                    };
                }
            }
        ]
    },
    {
        path: '*',
        element: null,
        loader: async () => redirect('/')
    }
])
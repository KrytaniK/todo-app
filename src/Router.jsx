import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import App from './App';
import { P_Project } from "./pages";
import Database from './utils/indexedDB';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        loader: async ({ params }) => {

            const db = new Database('todo');
            const projects = await db.store('projects').getAll();

            const lastViewedProject = localStorage.getItem('lastViewedProject') || projects[0].id;

            return { projects, currentProject: lastViewedProject };
        },
        children: [
            {
                path: '/projects/:projectID',
                element: <P_Project/>,
                loader: async ({params}) => {
                    const { projectID } = params;
                    
                    return {
                        projectID
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
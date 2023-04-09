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

            return { projects, currentProject: params.projectID };
        },
        children: [
            {
                path: '/projects/:projectID',
                element: <P_Project/>,
                loader: async ({params}) => {
                    const { projectID } = params;

                    const db = new Database('todo');
                    const project = await db.store('projects').get(projectID);

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
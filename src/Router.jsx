import React from "react";
import { createHashRouter, redirect } from "react-router-dom";
import App from './App';
import { P_Project } from "./pages";
import Database from './utils/indexedDB';

/*
    NOTE:
        Github pages doesn't natively support SPA's (Single Page Apps), meaning React Router's 'BrowserRouter' won't work in deployment. 
        A common workaroud seems to be replacing the BrowserRouter with a HashRouter. This does resolve the issue, however, at the cost 
        of a not-so-appealing URL. For the scope of this project, this solution works, however, under a hosted domain and a more complex
        and/or publicized app, a more integrated solution will be required.
*/

export const router = createHashRouter([
    {
        id: 'app',
        path: '/',
        element: <App />,
        loader: async () => {

            const db = new Database('todo');
            const projects = await db.store('projects').getAll();

            return { projects };
        },
        children: [
            {
                id: 'project',
                path: '/projects/:projectID',
                element: <P_Project/>,
                loader: async ({params}) => {
                    const { projectID } = params;

                    const db = new Database('todo');
                    const project = await db.store('projects').get(projectID);

                    if (!project) {
                        return redirect('/');
                    }

                    const filledTasks = {};
                    for (let taskID of project.tasks) {
                        const task = await db.store('tasks').get(taskID);
                        filledTasks[taskID] = task;
                    }

                    const statuses = await db.store('statuses').getAll();

                    return {
                        project: { ...project, tasks: filledTasks },
                        statuses
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
import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import App from './App';
import { P_Project } from "./pages";
import Database from './utils/indexedDB';

export const router = createBrowserRouter([
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
], {
    basename: '/todo-app'
})
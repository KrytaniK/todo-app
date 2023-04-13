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
        loader: async ({params}) => {

            const db = new Database('todo');
            const projects = await db.store('projects').getAll();

            const lastViewedProject = localStorage.getItem('lastViewedProject') || projects[0].id;

            if (!params.projectID && lastViewedProject)
                return redirect(`/projects/${lastViewedProject}`);

            return { projects, currentProject: lastViewedProject };
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

                    if (!project)
                        return redirect('/');

                    const newTasks = [];
                    for (let taskID of project.tasks) {
                        const task = await db.store('tasks').get(taskID);
                        if (!task) {
                            console.log(taskID, "was not found!!!!!", taskID);
                            console.log("Before", project.tasks);
                            project.tasks.splice(project.tasks.indexOf(taskID), 1);
                            console.log("AFter", project.tasks);
                            await db.store('projects').update({ ...project, tasks: [...project.tasks] });
                        }
                        newTasks.push(task);
                    }

                    return {
                        project: { ...project, tasks: newTasks },
                        taskIDList: project.tasks
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
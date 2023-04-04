import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from './App';
import { P_Project } from "./pages";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/projects/:id',
                element: <P_Project/>,
                loader: async ({params}) => {
                    const { id } = params;
                    
                    return {
                        project: {}
                    };
                }
            }
        ]
    }
])
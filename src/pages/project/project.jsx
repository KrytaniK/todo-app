import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard } from '../../components';
import './project.css';

const P_Project = () => {

    const [view, setView] = useState('List');

    const { project } = useLoaderData();

    return <div className="project-wrapper flex-column">
        <section className="project-header"></section>
        { view === 'List' && <C_ProjectList statuses={project.statuses}/> }
        { view === 'Board' && <C_ProjectBoard statuses={project.statuses}/> }
    </div>;
}

export default P_Project;
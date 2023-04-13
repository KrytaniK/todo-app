import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard } from '../../components';
import './project.css';

const P_Project = () => {

    const [view, setView] = useState('List');

    const { project } = useLoaderData();

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('projectchange', { detail: { projectID: project.id } }));
    }, [project]);

    return project && <div className="project-wrapper flex-column">
        <section className="project-header flex-row">
            <div className="project-name flex">
                <h1>{project.name}</h1>
            </div>
            <div className="project-tabs flex-row">
                <button className={`project-tab ${view === "List" ? "selected" : ""}`} onClick={() => { setView('List'); }}>
                    <p>List View</p>
                </button>
                <button className={`project-tab ${view === "Board" ? "selected" : ""}`}  onClick={() => { setView('Board'); }}>
                    Board
                </button>
            </div>
        </section>
        {view === 'List' && <C_ProjectList statusList={project.statuses} taskList={project.tasks} /> }
        {/* {view === 'Board' && <C_ProjectBoard statuses={_project.statuses} taskList={project.taskList} taskActions={project.taskActions} /> } */}
    </div>;
}

export default P_Project;
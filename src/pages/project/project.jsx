import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard } from '../../components';
import './project.css';
import { useIndexedDB } from "../../hooks";

const P_Project = () => {

    const { project } = useLoaderData();
    
    const [projectData, setProjectData] = useState(project);
    const [view, setView] = useState('List');

    const db = useIndexedDB();

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('projectchange', { detail: { projectID: project.id } }));
    }, [project]);

    const onProjectUpdate = (updatedData) => {

        const newProjectData = { ...projectData, ...updatedData };
        const newTaskIDList = newProjectData.tasks.map(task => task.id);

        db.update('projects', {
            ...newProjectData,
            tasks: [...newTaskIDList]
        }).then(() => {
            setProjectData(newProjectData);
        });
    }

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
        {view === 'List' && <C_ProjectList project={projectData} onProjectUpdate={onProjectUpdate}/> }
        {/* {view === 'Board' && <C_ProjectBoard statuses={_project.statuses} taskList={project.taskList} taskActions={project.taskActions} /> } */}
    </div>;
}

export default P_Project;
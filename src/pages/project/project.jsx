import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard, C_SVG } from '../../components';
import './project.css';
import { useIndexedDB, useProject } from "../../hooks";

const P_Project = () => {

    const [view, setView] = useState('List');

    const { projectID } = useLoaderData();

    const db = useIndexedDB();
    const {project, taskList, taskActions} = useProject(projectID, db);

    // const onProjectSearch = (event) => {

    //     event.preventDefault();

    //     const formData = new FormData(event.currentTarget);
    //     const data = Object.fromEntries(formData.entries());

    //     const searchQuery = data["searchQuery"];

    //     console.log(`Querying for "${searchQuery}"`);
    // }

    return project && <div className="project-wrapper flex-column">
        <section className="project-header flex-row">
            <div className="project-name flex">
                <h1>{project.name}</h1>
            </div>
            <div className="project-tabs flex-row">
                <button className={`project-tab ${view === "List" ? "selected" : ""}`} onClick={() => { setView('List'); }}>
                    <p>List View</p>
                </button>
                {/* <button className={`project-tab ${view === "Board" ? "selected" : ""}`}  onClick={() => { setView('Board'); }}>
                    Board
                </button> */}
            </div>
            {/* <div className="project-search flex">
                <form className="project-searchbar flex-row" onSubmit={onProjectSearch}>
                    <C_SVG sourceURL="/search.svg" size="1rem" color="var(--color-text)" />
                    <input type="text" name="searchQuery" placeholder={`Search in ${_project.name}`} aria-label="Project Search Bar"/>
                </form>
            </div> */}
        </section>
        {view === 'List' && <C_ProjectList statuses={project.statuses} taskList={taskList} taskActions={taskActions} /> }
        {/* {view === 'Board' && <C_ProjectBoard statuses={_project.statuses} taskList={project.taskList} taskActions={project.taskActions} /> } */}
    </div>;
}

export default P_Project;
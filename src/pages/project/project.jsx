import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard, C_SVG } from '../../components';
import './project.css';

const P_Project = () => {

    const [view, setView] = useState('List');

    const { project } = useLoaderData();

    const onProjectSearch = (event) => {

        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const searchQuery = data["searchQuery"];

        console.log(`Querying for "${searchQuery}"`);
    }

    return <div className="project-wrapper flex-column">
        <section className="project-header flex-row">
            <div className="project-name flex">
                <h1>{project.name}</h1>
            </div>
            <div className="project-tabs flex-row">
                <button className={`project-tab ${view === "List" ? "selected" : ""}`} onClick={() => { setView('List'); }}>
                    List
                </button>
                <button className={`project-tab ${view === "Board" ? "selected" : ""}`}  onClick={() => { setView('Board'); }}>
                    Board
                </button>
            </div>
            <div className="project-search flex">
                <form className="project-searchbar flex-row" onSubmit={onProjectSearch}>
                    <C_SVG sourceURL="/search.svg" size="1rem" color="var(--color-text)" />
                    <input type="text" name="searchQuery" placeholder={`Search in ${project.name}`} aria-label="Project Search Bar"/>
                </form>
            </div>
        </section>
        {view === 'List' && <C_ProjectList project={project} /> }
        {view === 'Board' && <C_ProjectBoard project={project} /> }
    </div>;
}

export default P_Project;
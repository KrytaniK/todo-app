import React, {useState} from "react";
import { Link } from "react-router-dom";
import { C_SVG } from '../';
import './sidebar.css';
import Database from "../../utils/indexedDB";

const C_Sidebar = ({ projects }) => {

    const [addingNewProject, setAddingNewProject] = useState(false);
    const [newProjects, setNewProjects] = useState([]);

    const onCreateNewProject = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newProject = {
            id: Math.floor(Math.random() * 1000),
            name: data["newProjectName"]
        }

        const db = new Database('todo');
        db.store('projects').add(newProject);
        setNewProjects([
            ...newProjects,
            newProject
        ]);
        setAddingNewProject(false);
    }
    
    return <section id="sidebar" className="flex-column">
        <h2 className="app-name">TT-01</h2>
        <nav className="nav-links flex-column">
            <section className="nav-links-category flex-column">
                <h6>PROJECTS</h6>
                <div className="nav-links-category-items flex-column">
                    {
                        projects && projects.map(project => <Link className="nav-links-category-item flex-row" key={project.id} to={`/projects/${project.id}`}>
                            <C_SVG sourceURL="/folder-open.svg" size="1.25rem" color="white" />
                            <h4>{project.name}</h4>
                        </Link>)
                    }
                    {
                        newProjects.length !== 0 && newProjects.map(project => <Link className="nav-links-category-item flex-row" key={project.id} to={`/projects/${project.id}`}>
                            <C_SVG sourceURL="/folder-open.svg" size="1.25rem" color="white" />
                            <h4>{project.name}</h4>
                        </Link>)
                    }
                    {
                        addingNewProject && <form className="nav-links-category-item flex-row" onSubmit={onCreateNewProject}>
                            <C_SVG sourceURL="/folder-open.svg" size="1.25rem" color="white" />
                            <input type="text" id="newProjectNameInput" name="newProjectName" aria-label="New Project Name" placeholder="New Project" autoFocus={true} />
                            <button type="submit">
                                <C_SVG sourceURL="/checkmark.svg" size="1.25rem" color="white" />
                            </button>
                            <button type="button" onClick={() => { setAddingNewProject(false); }}>
                                <C_SVG sourceURL="/x.svg" size="1.25rem" color="white" />
                            </button>
                        </form>
                    }
                </div>
            </section>
        </nav>
        <button className="add-project flex-row" onClick={() => { setAddingNewProject(true); }}>
            <C_SVG sourceURL="/plus-small.svg" size="1.25rem" color="white" />
            <h5>New Project</h5>
        </button>
    </section>;
}

export default C_Sidebar;
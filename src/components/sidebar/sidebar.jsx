import React, {useState} from "react";
import { Link } from "react-router-dom";
import { C_SVG, C_ContextMenu } from '../';
import { useIndexedDB } from "../../hooks";
import './sidebar.css';

const C_Sidebar = ({ projects }) => {

    const [addingNewProject, setAddingNewProject] = useState(false);
    const [projectList, setProjectList] = useState([...projects]);
    const db = useIndexedDB();

    const onRemoveProject = (index) => {
        const project = projectList[index];
        const id = project.id;
        
        db.remove('projects', id);
        
        projectList.splice(index, 1);
        setProjectList([...projectList]);
    }

    const onCreateNewProject = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newProject = {
            id: Math.floor(Math.random() * 1000),
            name: data["newProjectName"]
        }

        db.add('projects', newProject);

        setProjectList([
            ...projectList,
            newProject
        ]);
        setAddingNewProject(false);
    }
    
    return <section id="sidebar" className="flex-column">
        <h2 className="app-name">TT-01</h2>
        <nav className="nav-links flex-column">
            <section className="nav-links-category flex-column">
                <h6 className="nav-links-category-name">PROJECTS</h6>
                <div className="nav-links-category-items flex-column">
                    {
                        projectList.length !== 0 && projectList.map((project, index) => <C_ContextMenu key={project.id}  options={[
                            {
                                id: 'delete',
                                title: 'Delete Project',
                                color: '#EA274A',
                                callback: () => { onRemoveProject(index); }
                            }
                        ]}>
                            <Link className="nav-links-category-item flex-row" to={`/projects/${project.id}`}>
                                <C_SVG sourceURL="/folder-open.svg" size="1rem" color="white" />
                                <h5>{project.name}</h5>
                            </Link>
                        </C_ContextMenu>)
                    }
                    {
                        addingNewProject && <form className="nav-links-category-item flex-row" onSubmit={onCreateNewProject}>
                            <C_SVG sourceURL="/folder-open.svg" size="1rem" color="white" />
                            <input type="text" id="newProjectNameInput" name="newProjectName" aria-label="New Project Name" placeholder="New Project" autoFocus={true} />
                            <button type="submit">
                                <C_SVG sourceURL="/checkmark.svg" size="1rem" color="white" />
                            </button>
                            <button type="button" onClick={() => { setAddingNewProject(false); }}>
                                <C_SVG sourceURL="/x.svg" size="1rem" color="white" />
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
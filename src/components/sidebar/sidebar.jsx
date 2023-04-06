import React, {useState} from "react";
import { Link } from "react-router-dom";
import { C_SVG, C_ContextMenu } from '../';
import { useIndexedDB } from "../../hooks";
import './sidebar.css';

const C_Sidebar = ({ projects }) => {

    const [addingNewProject, setAddingNewProject] = useState(false);
    const [renameIndex, setRenameIndex] = useState(-1);
    const [projectList, setProjectList] = useState([...projects]);
    const [selectedProject, setSelectedProject] = useState(undefined);
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

    const onRenameProject = (event, project, index) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newName = data["newProjectName"];

        const newProject = { ...project, name: newName };

        db.update('projects', newProject);
        
        projectList.splice(index, 1, newProject);

        setProjectList([
            ...projectList
        ])
        setRenameIndex(-1);
    }

    const projectLinkOptions = (id, index) => {
        return [
            {
                id: 'rename',
                title: 'Rename',
                color: 'var(--color-text)',
                callback: () => { setRenameIndex(id); }
            },
            {
                id: 'delete',
                title: 'Delete Project',
                color: 'var(--color-error)',
                callback: () => { onRemoveProject(index); }
            }
        ]
    }
    
    return <section id="sidebar" className="flex-column">
        <h2 className="app-name">TT-01</h2>
        <nav className="nav-links flex-column">
            <section className="nav-links-category flex-column">
                <h6 className="nav-links-category-name">PROJECTS</h6>
                <div className="nav-links-category-items flex-column">
                    {
                        projectList.length !== 0 && projectList.map((project, index) => {

                            if (renameIndex === project.id) return <C_NewProjectInput key={project.id} onSubmit={e => onRenameProject(e, project, index)} onCancel={() => { setRenameIndex(-1); }} placeholderText={project.name}/>
                            
                            return <C_ContextMenu key={project.id} options={projectLinkOptions(project.id, index)}>
                                <Link
                                    className={`nav-links-category-item flex-row ${selectedProject === project.id ? 'selected' : ''}`}
                                    to={`/projects/${project.id}`}
                                    onClick={() => { setSelectedProject(project.id); }}
                                >
                                    <C_SVG sourceURL="/folder-open.svg" size="1rem" color="var(--color-text)" />
                                    <h5>{project.name}</h5>
                                </Link>
                            </C_ContextMenu>
                        })
                    }
                    {
                        addingNewProject && <C_NewProjectInput onSubmit={onCreateNewProject} onCancel={() => { setAddingNewProject(false); }} />
                    }
                </div>
            </section>
        </nav>
        <button className="add-project flex-row" onClick={() => { setAddingNewProject(true); }}>
            <C_SVG sourceURL="/plus-small.svg" size="1.25rem" color="var(--color-text)" />
            <h5>New Project</h5>
        </button>
    </section>;
}

const C_NewProjectInput = ({ onSubmit, onCancel, placeholderText }) => {
    return <form id="newProjectForm" className="nav-links-category-item flex-row" onSubmit={onSubmit}>
        <C_SVG sourceURL="/folder-open.svg" size="1rem" color="var(--color-text)" />
        <input type="text" id="newProjectNameInput" name="newProjectName" aria-label="New Project Name" placeholder={`${placeholderText || 'New Project'}`} autoFocus={true} />
        <button type="submit">
            <C_SVG sourceURL="/checkmark.svg" size="1rem" color="var(--color-text)" />
        </button>
        <button type="button" onClick={() => { onCancel(false); }}>
            <C_SVG sourceURL="/x.svg" size="1rem" color="var(--color-text)" />
        </button>
    </form>
}

export default C_Sidebar;
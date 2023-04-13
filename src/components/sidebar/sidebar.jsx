import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { C_SVG, C_ContextMenu } from '../';
import { Project } from "../../utils/schemas";
import { useIndexedDB } from "../../hooks";
import './sidebar.css';

const C_Sidebar = ({ projects, currentProject }) => {

    const [addingNewProject, setAddingNewProject] = useState(false);
    const [renameIndex, setRenameIndex] = useState(-1);
    const [projectList, setProjectList] = useState([...projects]);
    const [selectedProject, setSelectedProject] = useState(undefined);

    const db = useIndexedDB();
    const navigate = useNavigate();

    useEffect(() => {
        const changeProject = (event) => {
            const { detail: { projectID } } = event;
            setSelectedProject(projectID);
        }

        window.addEventListener('projectchange', changeProject);

        return () => {
            window.removeEventListener('projectchange', changeProject);
        }
    })

    useEffect(() => {
        localStorage.setItem('lastViewedProject', selectedProject);
    }, [selectedProject]);

    const onCreateProject = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newName = data["newProjectName"] || "New Project";

        db.getAll('statuses').then(statuses => {
            const newProject = new Project({
                name: newName,
                statuses: statuses.filter(status => status.isTemplate)
            });

            db.add('projects', newProject).then(() => {
                setProjectList([
                    ...projectList,
                    newProject
                ]);
                setAddingNewProject(false);
                setSelectedProject(newProject.id);
                navigate(`/projects/${newProject.id}`);
            });

        })
    }

    const onRenameProject = (event, project, index) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newName = data["newProjectName"];

        if (newName.length === 0) {
            setRenameIndex(-1);
            return;
        }

        const newProject = { ...project, name: newName };

        db.update('projects', newProject);
        
        projectList.splice(index, 1, newProject);

        setProjectList([
            ...projectList
        ])
        setRenameIndex(-1);
    }

    const onRemoveProject = (index) => {
        const project = projectList[index];
        const id = project.id;

        let projectTasks = [...project.tasks];

        // Optionally in the future, it would be nice to instead offer the option to move tasks to a new project

        db.remove('projects', id).then(() => {
            for (const task of projectTasks) {
                db.remove('tasks', task);
            }
        });
        
        projectList.splice(index, 1);
        setProjectList([...projectList]);
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
                        addingNewProject && <C_NewProjectInput onSubmit={onCreateProject} onCancel={() => { setAddingNewProject(false); }} />
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
        <button type="button" onClick={onCancel}>
            <C_SVG sourceURL="/x.svg" size="1rem" color="var(--color-text)" />
        </button>
    </form>
}

export default C_Sidebar;
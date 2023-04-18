import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { C_ProjectList, C_ProjectBoard } from '../../components';
import './project.css';
import { useIndexedDB } from "../../hooks";

const P_Project = () => {

    const { project, statuses } = useLoaderData();
    
    const [projectData, setProjectData] = useState(undefined);
    const [statusList, setStatusList] = useState(undefined);
    const [view, setView] = useState('List');

    useEffect(() => {
        if (!project) return;

        setProjectData({ ...project });
    }, [project]);

    useEffect(() => {
        if (!statuses) return;
        
        setStatusList([...statuses]);
    }, [statuses]);
    

    const db = useIndexedDB();

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('projectchange', { detail: { projectID: project.id } }));
    }, [project]);

    const onProjectUpdate = (updatedData) => {

        const newProjectData = { ...projectData, ...updatedData };
        const newTaskIDList = newProjectData.tasks.map(task => task.id);

        const newStatuses = newProjectData.statuses.filter(status => {
            for (let _status of statusList) {
                if (_status.id === status.id) return false;
            }

            return true;
        });

        db.update('projects', {
            ...newProjectData,
            tasks: [...newTaskIDList]
        }).then(() => {
            setProjectData(newProjectData);
            setStatusList([...statusList, ...newStatuses]);
        });
    }

    return projectData && statusList && <div className="project-wrapper">
        <section className="project-header flex-row">
            <div className="project-name flex">
                <h1>{project.name}</h1>
            </div>
            <div className="project-tabs flex-row">
                <button className={`project-tab ${view === "List" ? "selected" : ""}`} onClick={() => { setView('List'); }}>
                    <p>List View</p>
                </button>
                <button className={`project-tab ${view === "Board" ? "selected" : ""}`}  onClick={() => { setView('Board'); }}>
                    <p>Board View</p>
                </button>
            </div>
        </section>
        {
            view === 'List' && <C_ProjectList
                project={projectData}
                statuses={statusList.filter(status => {
                    for (let _status of projectData.statuses) {
                        if (_status.id === status.id) return false;
                    }
                    return true;
                })} 
                onProjectUpdate={onProjectUpdate}
            />
        }
        {
            view === 'Board' && <C_ProjectBoard
                project={projectData}
                statuses={statusList.filter(status => {
                    for (let _status of projectData.statuses) {
                        if (_status.id === status.id) return false;
                    }
                    return true;
                })}
                onProjectUpdate={onProjectUpdate}
            />
        }
    </div>;
}

export default P_Project;
import React, { useState, useEffect } from "react";
import C_List_Status from "./listStatus";
import './projectList.css';
import C_Dropdown from "../dropdown/dropdown";
import { useIndexedDB } from "../../hooks";

const C_ProjectList = ({ project, taskIDList, statusList, taskList }) => {

    const [viewedTasks, setViewedTasks] = useState([...taskList]);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const db = useIndexedDB();

    const onTaskStatusChange = (task) => {
        for (let i = 0; i < viewedTasks.length; i++) {
            if (viewedTasks[i].id === task.id) {
                viewedTasks.splice(i, 1, task);
                setViewedTasks([...viewedTasks]);
            }
        }
    }

    const onSelectTask = (task) => { 
        setSelectedTasks([...selectedTasks, task]);
    }

    const onDeselectTask = (task) => {
        for (let i = 0; i < selectedTasks.length; i++) {
            if (selectedTasks[i].id === task.id) {
                selectedTasks.splice(i, 1);
                setSelectedTasks([...selectedTasks]);
            }
        }
    }

    const moveSelectedTasksToStatus = (newStatus) => {
        const updatedTasks = [];
        for (let task of selectedTasks) {
            const newTask = { ...task, status: newStatus };
            updatedTasks.push(newTask);
            onTaskStatusChange(newTask);
        }

        db.updateMany('tasks', updatedTasks).then(() => {
            setSelectedTasks([]);
        });
    }

    const deleteSelectedTasks = () => {
        
        const selectedIDs = selectedTasks.map(({ id }) => id);

        const newViewedTasks = viewedTasks.filter(({id}) => !selectedIDs.includes(id) );
        const newProjectTasks = taskIDList.filter(id => !selectedIDs.includes(id) );

        db.removeMany('tasks', selectedIDs).then(() => {
            db.update('projects', {
                ...project,
                tasks: [...newProjectTasks]
            }).then(() => {
                setSelectedTasks([]);
                setViewedTasks(newViewedTasks);
            });
        });
    }

    const selectedTaskOptions = [
        {
            id: 'selected-moveto',
            title: 'Move To',
            color: 'var(--color-text)',
            options: statusList.map(status => {
                return {
                    id: 'selected-moveto' + status.id,
                    title: status.name,
                    color: 'var(--color-text)',
                    callback: () => { moveSelectedTasksToStatus(status.id); }
                }
            })
        },
        {
            id: 'selected-delete',
            title: 'Delete Tasks',
            color: 'var(--color-error)',
            callback: deleteSelectedTasks
        }
    ]

    return <>
        <section className="project-list-view flex-column">
            <div className="project-list-header flex-row">
                <C_Dropdown title={`${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} selected`} options={selectedTaskOptions} />
                
            </div>
            {statusList && statusList.map((status) => <C_List_Status
                key={status.id}
                project={project}
                status={status}
                taskList={viewedTasks}
                onTaskStatusChange={onTaskStatusChange}
                onSelectTask={onSelectTask}
                onDeselectTask={onDeselectTask}
            />)}
        </section>
    </>;
}

export default C_ProjectList;
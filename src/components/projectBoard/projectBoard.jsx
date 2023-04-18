import React, { useState } from "react";
import { useIndexedDB, useModal } from "../../hooks";
import { C_Dropdown } from '../';
import C_Board_Status from "./boardStatus";
import './projectBoard.css';

const C_ProjectBoard = ({ project, statuses, onProjectUpdate }) => {
    
    const [selectedTasks, setSelectedTasks] = useState([]);

    const db = useIndexedDB();
    const newStatusModal = useModal();

    const addStatus = (status) => {
        onProjectUpdate({ statuses: [...project.statuses, status] });
    }

    const saveStatus = (status) => {
        const newStatuses = [...project.statuses];
        for (let i = 0; i < newStatuses.length; i++) {
            if (newStatuses[i].id === status.id) {
                newStatuses.splice(i, 1, status);
                break;
            }
        }

        onProjectUpdate({ statuses: [...newStatuses] });
    }

    const removeStatus = (status) => {
        onProjectUpdate({ statuses: project.statuses.filter(_status => _status.id !== status.id) });
    }

    const addTask = (task) => {
        onProjectUpdate({ tasks: [...project.tasks, task] });
    }

    const updateTask = (task) => {
        onProjectUpdate({
            tasks: project.tasks.map(_task => {
                if (_task.id === task.id)
                return task;
                
                return _task;
            })
        });
    }

    const removeTask = (task) => {
        onProjectUpdate({ tasks: project.tasks.filter(_task => _task.id !== task.id) });
    }

    const selectTask = (task) => { 
        setSelectedTasks([...selectedTasks, task]);
    }

    const deselectTask = (task) => {
        for (let i = 0; i < selectedTasks.length; i++) {
            if (selectedTasks[i].id === task.id) {
                selectedTasks.splice(i, 1);
                setSelectedTasks([...selectedTasks]);
            }
        }
    }

    const moveSelectedTasksToStatus = (newStatus) => {

        const newProjectTasks = [...project.tasks];
        for (let task of selectedTasks) {
            for (let i = 0; i < newProjectTasks.length; i++) {
                if (newProjectTasks[i].id === task.id) {
                    newProjectTasks.splice(i, 1, { ...task, status: newStatus });
                    break;
                }
            }
        }

        db.updateMany('tasks', newProjectTasks).then(() => {
            onProjectUpdate({ tasks: newProjectTasks });
            setSelectedTasks([]);
        });
    }

    const deleteSelectedTasks = () => {
        
        const selectedIDs = selectedTasks.map(({ id }) => id);

        const newProjectTasks = project.tasks.filter((task) => !selectedIDs.includes(task.id));

        db.removeMany('tasks', selectedIDs).then(() => {
            onProjectUpdate({ tasks: newProjectTasks });
            setSelectedTasks([]);
        });
    }

    const newStatusOptions = [
        ...statuses.map(status => {
            return {
                id: `new-status-${status.id}`,
                title: status.name,
                color: 'var(--color-text)',
                callback: () => { addStatus(status); }
            }
        }),
        {
            id: 'create-new-status',
            title: 'Create A New Status',
            color: 'var(--color-secondary)',
            callback: newStatusModal.toggle
        }
    ]

    const selectedTaskOptions = [
        {
            id: 'selected-moveto',
            title: 'Move To',
            color: 'var(--color-text)',
            options: project.statuses.map(status => {
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

    return <section className="project-board-view flex-column">
        <div className="project-board-header flex-row">
            <C_Dropdown title="Add New Status" options={newStatusOptions} alignment="parent-left"/>
            <C_Dropdown title={`${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} selected`} options={selectedTaskOptions} alignment="parent-right"/>
        </div>
        <div className="project-board-statuses flex-row">
            {
                project.statuses && project.statuses.map((status) => <C_Board_Status
                    key={status.id}
                    status={status}
                    statusList={project.statuses}
                    taskList={project.tasks.filter((task) => task.status === status.id)}
                    selectedTasks={selectedTasks.map(({ id }) => id)}
                    saveStatus={saveStatus}
                    removeStatus={removeStatus}
                    addTask={addTask}
                    updateTask={updateTask}
                    removeTask={removeTask}
                    selectTask={selectTask}
                    deselectTask={deselectTask}
                />)
            }
        </div>
    </section>;
}

export default C_ProjectBoard;
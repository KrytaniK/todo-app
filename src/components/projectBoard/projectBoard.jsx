import React, { useState } from "react";
import { useIndexedDB, useModal } from "../../hooks";
import { C_Dropdown } from '../';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import C_Board_Status from "./boardStatus";
import './projectBoard.css';

const C_ProjectBoard = ({ project, statuses, onProjectUpdate }) => {
    
    const [selectedTasks, setSelectedTasks] = useState([]);

    const db = useIndexedDB();
    const newStatusModal = useModal();

    const addStatus = (status) => {
        const newStatuses = { ...project.statuses };


        let statusTaskIDs = [];
        if (project.hasOwnProperty('cachedStatusTaskIDs') && project.cachedStatusTaskIDs[status.id]) {
            statusTaskIDs = project.cachedStatusTaskIDs[status.id];
        }

        newStatuses[status.id] = { ...status, taskIDs: statusTaskIDs };
        
        onProjectUpdate({ statuses: newStatuses, statusOrder: [...project.statusOrder, status.id] });
    }

    const saveStatus = (status) => {
        const newStatuses = { ...project.statuses };
        newStatuses[status.id] = status;

        onProjectUpdate({ statuses: newStatuses });
    }

    const removeStatus = (status) => {
        const newStatuses = { ...project.statuses };
        delete newStatuses[status.id];

        const newStatusOrder = project.statusOrder.filter(id => id !== status.id);

        onProjectUpdate({ statuses: newStatuses, statusOrder: newStatusOrder });
    }

    const addTask = (task) => {
        const newProjectTasks = { ...project.tasks };
        newProjectTasks[task.id] = task;

        const taskStatus = project.statuses[task.status];
        const updatedStatus = { ...taskStatus, taskIDs: [...taskStatus.taskIDs, task.id] };

        onProjectUpdate({ tasks: newProjectTasks, statuses: {...project.statuses, [updatedStatus.id]: updatedStatus} });
    }

    const updateTask = (task) => {
        const newProjectTasks = { ...project.tasks };

        const oldTask = { ...newProjectTasks[task.id] };

        newProjectTasks[task.id] = task;

        for (let i = 0; i < selectedTasks.length; i++) {
            if (selectedTasks[i].id === task.id) {
                selectedTasks.splice(i, 1);
                setSelectedTasks([...selectedTasks]);
                break;
            }
        }

        if (oldTask.status === task.status) {
            onProjectUpdate({ tasks: newProjectTasks });
            return;
        }

        const oldStatus = project.statuses[oldTask.status];
        const newStatus = project.statuses[task.status];

        const updatedOldStatus = { ...oldStatus, taskIDs: oldStatus.taskIDs.filter(id => task.id !== id) };
        const updatedNewStatus = { ...newStatus, taskIDs: [...newStatus.taskIDs, task.id] };

        onProjectUpdate({
            tasks: newProjectTasks,
            statuses: {
                ...project.statuses,
                [updatedOldStatus.id]: updatedOldStatus,
                [updatedNewStatus.id]: updatedNewStatus
            }
        });
        return;
    }

    const removeTask = (task) => {
        const newProjectTasks = { ...project.tasks };
        delete newProjectTasks[task.id];

        const taskStatus = project.statuses[task.status];
        const updatedStatus = { ...taskStatus, taskIDs: taskStatus.taskIDs.filter(id => task.id !== id) };

        onProjectUpdate({ tasks: newProjectTasks, statuses: {...project.statuses, [taskStatus.id]: updatedStatus} });
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

        const updatedStatuses = { ...project.statuses };
        const updatedTasks = { ...project.tasks };
        const dbTasks = [];

        for (let task of selectedTasks) {
            if (task.status === newStatus) continue;

            // Remove Task From Old Status
            const oldStatus = updatedStatuses[task.status];
            const oldStatusTasks = oldStatus.taskIDs;
            const index = oldStatusTasks.indexOf(task.id);
            oldStatusTasks.splice(index, 1);

            // Update Statuses Object
            updatedStatuses[task.status] = { ...oldStatus, taskIDs: [...oldStatusTasks] };

            // Add the task to the new Status
            const _newStatus = updatedStatuses[newStatus];
            const newStatusTasks = _newStatus.taskIDs;
            newStatusTasks.push(task.id);

            // Update statuses object
            updatedStatuses[newStatus] = { ..._newStatus, taskIDs: newStatusTasks };

            const updatedTask = { ...task, status: newStatus };
            dbTasks.push(updatedTask)
            updatedTasks[task.id] = updatedTask;
        }

        db.updateMany('tasks', dbTasks).then(() => {
            onProjectUpdate({ tasks: updatedTasks, statuses: { ...updatedStatuses } });
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
        ...statuses.filter(status => !project.statuses.hasOwnProperty(status.id)).map(status => {
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
            options: project.statusOrder.map(statusID => {
                return {
                    id: 'selected-moveto' + statusID,
                    title: project.statuses[statusID].name,
                    color: 'var(--color-text)',
                    callback: () => { moveSelectedTasksToStatus(statusID); }
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

    // Drag and Drop
    const onDragEnd = (result) => {
        const { source, destination, draggableId, type } = result;

        if (!destination)
            return;
        
        if (source.index === destination.index &&
            source.droppableId === destination.droppableId)
            return;
        
        switch (type) {
            case "task":
                 // Moving within the same status
                if (source.droppableId === destination.droppableId) {
                    const status = project.statuses[source.droppableId];
                    const newTaskIDs = [...status.taskIDs];

                    newTaskIDs.splice(source.index, 1);
                    newTaskIDs.splice(destination.index, 0, draggableId);

                    const newStatus = {
                        ...status,
                        taskIDs: newTaskIDs
                    }

                    onProjectUpdate({ statuses: { ...project.statuses, [status.id]: newStatus } });
                    return;
                }

                // Moving to another status
                const sourceStatus = project.statuses[source.droppableId];
                const newSourceTaskIDs = [...sourceStatus.taskIDs];
                const destinationStatus = project.statuses[destination.droppableId];
                const newDestinationTaskIDs = [...destinationStatus.taskIDs];

                newSourceTaskIDs.splice(source.index, 1);
                newDestinationTaskIDs.splice(destination.index, 0, draggableId);

                const newSourceStatus = {
                    ...sourceStatus,
                    taskIDs: newSourceTaskIDs
                }

                const newDestinationStatus = {
                    ...destinationStatus,
                    taskIDs: newDestinationTaskIDs
                }

                onProjectUpdate({
                    statuses: {
                        ...project.statuses,
                        [sourceStatus.id]: newSourceStatus,
                        [destinationStatus.id]: newDestinationStatus
                    }
                })
                break;
            case "status":
                const statusOrder = [...project.statusOrder];
                statusOrder.splice(source.index, 1);
                statusOrder.splice(destination.index, 0, draggableId);
                onProjectUpdate({statusOrder: [...statusOrder]})
                break;
        }
    }

    return <section className="project-board-view flex-column" >
        <div className="project-board-header flex-row">
            <C_Dropdown title="Add New Status" options={newStatusOptions} alignment="parent-left"/>
            <C_Dropdown title={`${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} selected`} options={selectedTaskOptions} alignment="parent-right"/>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="project-statuses" direction="horizontal" type="status">
                {(provided) => {
                    return <div className="project-board-statuses flex-row" {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            project.statusOrder.map((statusID, index) => <C_Board_Status
                                key={statusID}
                                status={project.statuses[statusID]}
                                index={index}
                                statusList={Object.values(project.statuses)}
                                tasks={project.tasks}
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
                        {provided.placeholder}
                    </div>
                }}
            </Droppable>
        </DragDropContext>
        
    </section>;
}

export default C_ProjectBoard;
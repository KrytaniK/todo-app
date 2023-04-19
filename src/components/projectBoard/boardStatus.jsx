import React, { useState } from "react";
import { C_ContextMenu, C_Collapsible, C_SVG, C_StatusModal } from '../';
import { useIndexedDB, useModal } from "../../hooks";
import C_Board_NewTaskForm from "./newTaskForm";
import { getDataFromForm } from "../../utils/util";
import { Task } from "../../utils/schemas";
import C_Board_Task from "./boardTask";
import { Droppable, Draggable } from "react-beautiful-dnd";

const C_Board_Status = ({ status, index, statusList, tasks, selectedTasks, saveStatus, removeStatus, addTask, updateTask, removeTask, selectTask, deselectTask }) => {
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const db = useIndexedDB();
    const statusModalControl = useModal();

    const addTaskToStatus = (event) => {
        event.preventDefault();
        const { taskName } = getDataFromForm(event.currentTarget);
        const newTask = new Task({ name: taskName, status: status.id });

        db.add('tasks', newTask).then(() => {
            addTask(newTask);
            setIsAddingTask(false);
        })
    }

    const onSaveStatus = (updatedStatus) => {
        db.update('statuses', updatedStatus).then(() => {
            saveStatus(updatedStatus);
        })
    }

    const statusModalOptions = [
        {
            id: 'status-view',
            title: 'Edit Status',
            color: 'var(--color-text)',
            callback: statusModalControl.toggle
        },
        {
            id: 'status-delete',
            title: 'Delete Status',
            color: 'var(--color-error)',
            callback: () => { removeStatus(status); }
        }
    ]

    return <Draggable draggableId={status.id} index={index}>
        {(provided) => {
            return <section
                className="project-board-status flex-column"
                {...provided.draggableProps}
                ref={provided.innerRef}
            >
                <C_ContextMenu options={statusModalOptions}>
                    <div
                        className="project-board-status-header flex-row"
                        style={{ borderBottom: `2px solid ${status.color}` }}
                        {...provided.dragHandleProps}
                    >
                        <h3 className="project-board-status-name">{status.name}</h3>
                        <p className="small project-board-status-taskCount">{status.taskIDs.length} task{status.taskIDs.length === 1 ? '' : 's'}</p>
                        <button aria-label="Status Expand Button" className={`expandStatusBtn ${isCollapsed ? 'collapsed' : ''}`} onClick={() => { setIsCollapsed(!isCollapsed); }} >
                            <C_SVG sourceURL="/chevron-down.svg" size="1.25rem" color="var(--color-text)" />
                        </button>
                    </div>
                </C_ContextMenu>
                <Droppable droppableId={status.id} type="task">
                    {(provided, snapshot) => {
                        return <C_Collapsible id={status.id} isCollapsed={isCollapsed} enableScroll={true}>
                            <ul
                                className="project-board-status-items flex-column"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={snapshot.isDraggingOver ? { backgroundColor: "#373737" } : {}}
                            >
                                
                                {isAddingTask && <C_Board_NewTaskForm onSubmit={addTaskToStatus} onCancel={() => { setIsAddingTask(false); }} />}
                                
                                {
                                    status.taskIDs.map((taskID, index) => {
                                        return <C_Board_Task
                                            key={taskID}
                                            statusList={statusList}
                                            task={tasks[taskID]}
                                            index={index}
                                            color={status.color}
                                            selected={selectedTasks.includes(taskID)}
                                            updateTask={updateTask}
                                            removeTask={removeTask}
                                            selectTask={selectTask}
                                            deselectTask={deselectTask}
                                        />;
                                    })
                                }
                                {provided.placeholder}
                            </ul>
                        </C_Collapsible>
                    }}
                </Droppable>
                <button className="project-board-status-addNewBtn flex-row" onClick={() => { setIsAddingTask(true); }}>
                    <C_SVG sourceURL="/plus-small.svg" size="1rem" color="var(--color-text)" />
                    <p className="small">
                        New Task
                    </p>
                </button>
                <C_StatusModal status={status} control={statusModalControl} onSave={onSaveStatus} />
            </section>;
        }}
    </Draggable>;
}

export default C_Board_Status;
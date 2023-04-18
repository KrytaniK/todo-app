import React, { useState } from "react";
import { C_Collapsible, C_ContextMenu, C_SVG, C_StatusModal } from "../";
import C_List_Task from "./listTask";
import C_List_NewTaskForm from "./newTaskForm";
import { Task } from "../../utils/schemas";
import { useIndexedDB, useModal } from "../../hooks";
import { getDataFromForm } from "../../utils/util";

const C_List_Status = ({status, statusList, taskList, selectedTasks, saveStatus, removeStatus, addTask, updateTask, removeTask, selectTask, deselectTask }) => {

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

    return <section className="project-status">
        <C_ContextMenu options={statusModalOptions}>
            <div className="project-status-header flex-row">
                <button aria-label="Status Expand Button" className={`expandStatusBtn ${isCollapsed ? 'collapsed' : ''}`} onClick={() => { setIsCollapsed(!isCollapsed); }} >
                    <C_SVG sourceURL="/chevron-up.svg" size="1rem" color="var(--color-text)"/>
                </button>
                <div className="project-list-status-name" style={{ color: status.color }}>{status.name}</div>

                {
                    isCollapsed ? <p className="project-status-taskCount small">{taskList.length} task{taskList.length === 1 ? '' : 's'}</p> :
                        <button className="newTaskBtn flex-row" onClick={() => { setIsAddingTask(true); }}>
                            <C_SVG sourceURL="/plus-small.svg" size="1rem" color="var(--color-text)" />
                            <p className="small">New Task</p>
                        </button>
                }
            </div>
        </C_ContextMenu>
        <C_Collapsible id={status.id} isCollapsed={isCollapsed}>
            <ul className="project-status-items flex-column">
                
                {isAddingTask && <C_List_NewTaskForm onSubmit={addTaskToStatus} onCancel={() => { setIsAddingTask(false); }} />}
                
                {taskList && taskList.map(task => {
                    return <C_List_Task
                        key={task.id}
                        statusList={statusList}
                        task={task}
                        color={status.color}
                        selected={selectedTasks.includes(task.id)}
                        updateTask={updateTask}
                        removeTask={removeTask}
                        selectTask={selectTask}
                        deselectTask={deselectTask}
                    />;
                })}
            </ul>
        </C_Collapsible>
        <C_StatusModal status={status} control={statusModalControl} onSave={onSaveStatus} />
    </section>
}

export default C_List_Status;

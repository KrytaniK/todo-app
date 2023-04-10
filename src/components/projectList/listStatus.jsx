import React, { useState } from "react";
import { C_SVG, C_TaskModal } from "../";
import C_List_NewTaskForm from "./newTaskForm";
import { Task, ContextMenuItem } from "../../utils/schemas";
import { useIndexedDB, useModal, useStatus } from "../../hooks";
import C_List_Task from "./listTask";
import { getDataFromForm } from "../../utils/util";

const C_List_Status = ({ status: {id, name, color}, taskList, statusList, taskActions }) => {

    const { selectTask, deselectTask } = taskActions;

    const [addingTask, setAddingTask] = useState(false);
    const [renameIndex, setRenameIndex] = useState(-1);
    const [viewedTask, setViewedTask] = useState(undefined);

    const db = useIndexedDB();
    const status = useStatus(id, taskList, db);
    const taskModalControl = useModal();

    const onCreateTask = (event) => {
        event.preventDefault();

        const { taskName } = getDataFromForm(event.currentTarget);
        const task = new Task({ name: taskName, status: id });
        taskActions.addTask(task);
        status.addTask(task);
        setAddingTask(false);
    }

    const onRenameTask = (event, task) => {
        event.preventDefault();

        const { taskName } = getDataFromForm(event.currentTarget);

        const updatedTask = { ...task, name: taskName };
        taskActions.updateTask(updatedTask);
        status.updateTask(updatedTask);
        setRenameIndex(-1);
    }

    const onSaveTask = (task) => {
        taskActions.updateTask(task);
        status.updateTask(task);
    }

    const generateTaskContextOptions = (task, taskIndex) => {
        return [
            new ContextMenuItem({
                title: 'View / Edit',
                color: 'var(--color-text)',
                callback: () => { setViewedTask(task); taskModalControl.toggle(); }
            }),
            new ContextMenuItem({
                title: 'Move To',
                color: 'var(--color-text)',
                subOptions: [
                    new ContextMenuItem({
                        title: 'Status',
                        color: 'var(--color-text)',
                        subOptions: statusList.map(_status => new ContextMenuItem({
                            title: _status.name,
                            color: 'var(--color-text)',
                            callback: () => { taskActions.moveTask(task, _status.id); }
                        }))
                    })
                ]
            }),
            new ContextMenuItem({ title: 'Rename', color: 'var(--color-text)', callback: () => { setRenameIndex(taskIndex); } }),
            new ContextMenuItem({ title: 'Delete Task', color: 'var(--color-error)', callback: () => { taskActions.deleteTask(task); }})
        ]
    }

    return <section className="project-status">
        <div className="project-status-header flex-row">
            <button className="expandStatusBtn">
                <C_SVG sourceURL="/chevron-down.svg" size="1rem" color="var(--color-text)"/>
            </button>
            <h3 style={{ color: color }}>{name}</h3>
            <button className="newTaskBtn flex-row" onClick={() => { setAddingTask(true); }}>
                <C_SVG sourceURL="/plus-small.svg" size="1rem" color="var(--color-text)" />
                <h6>New Task</h6>
            </button>
            <div className="status-descriptors flex-row">
            </div>
        </div>
        <ul className="project-status-items flex-column">
            {addingTask && <C_List_NewTaskForm onSubmit={onCreateTask} onCancel={() => { setAddingTask(false); }} />}
            {status.tasks && status.tasks.map((task, index) => {
                if (renameIndex === index)
                    return <C_List_NewTaskForm
                        key={task.id}
                        placeholderText={task.name}
                        onSubmit={(e) => { onRenameTask(e, task); }}
                        onCancel={() => { setRenameIndex(-1); }}
                    />

                return <C_List_Task
                    key={task.id}
                    task={task}
                    color={color}
                    onSelect={selectTask}
                    onDeselect={deselectTask}
                    contextOptions={generateTaskContextOptions(task, index)}
                />;
            })}
        </ul>
        <C_TaskModal control={taskModalControl} task={viewedTask} onSaveTask={onSaveTask} />
    </section>
}

export default C_List_Status;

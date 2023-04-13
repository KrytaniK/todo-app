import React, { useState } from "react";
import { C_ContextMenu, C_TaskModal } from '../';
import { useRouteLoaderData } from "react-router-dom";
import { useModal } from "../../hooks";
import { ContextMenuItem } from "../../utils/schemas";
import C_List_NewTaskForm from "./newTaskForm";
import { getDataFromForm } from "../../utils/util";
import { useIndexedDB } from "../../hooks";

const C_List_Task = ({ taskData, color, project, taskList, removeTaskFromStatus, changeTaskStatus, onSelectTask, onDeselectTask }) => {

    const [selected, setSelected] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [task, setTask] = useState({ ...taskData });
    
    const db = useIndexedDB();
    const _modal = useModal();

    const selectTask = (event) => {
        event.stopPropagation();

        if (!selected)
            onSelectTask(task);
        else
            onDeselectTask(task);


        setSelected(!selected);
    }

    const updateTask = (task) => {
        db.update('tasks', task).then(() => {
            setTask(task);
        });
    }

    const deleteTask = () => {

        const newTaskList = [];
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id !== task.id)
                newTaskList.push(project.tasks[i].id);
        }

        db.update('projects', { ...project, tasks: [...newTaskList] }).then(() => {
            db.remove('tasks', task.id);
        }).then(() => {
            removeTaskFromStatus(task);
        })
    }

    const onRenameSubmit = event => {
        event.preventDefault();
        const { taskName } = getDataFromForm(event.currentTarget);

        updateTask({ ...task, name: taskName });
        setIsRenaming(false);
    }

    const onMovetask = (newStatusID) => {
        task.status = newStatusID;
        updateTask(task);
        changeTaskStatus(task);
        if (selected)
            onDeselectTask(task);
    }

    const generateContextOptions = () => {
        return [
            new ContextMenuItem({
                title: 'View / Edit',
                color: 'var(--color-text)',
                callback: () => { _modal.toggle(); }
            }),
            new ContextMenuItem({
                title: 'Move To',
                color: 'var(--color-text)',
                subOptions: [
                    new ContextMenuItem({
                        title: 'Status',
                        color: 'var(--color-text)',
                        subOptions: project.statuses.map(status => new ContextMenuItem({
                            title: status.name,
                            color: 'var(--color-text)',
                            callback: () => { onMovetask(status.id); }
                        }))
                    })
                ]
            }),
            new ContextMenuItem({ title: 'Rename', color: 'var(--color-text)', callback: () => { setIsRenaming(true); } }),
            new ContextMenuItem({ title: 'Delete Task', color: 'var(--color-error)', callback: deleteTask})
        ]
    }

    if (!task) return null;

    return task && isRenaming ? <C_List_NewTaskForm placeholderText={task.name} onSubmit={onRenameSubmit} onCancel={() => { setIsRenaming(false); }} /> : <>
        <C_ContextMenu options={generateContextOptions()}>
            <div className="project-listTask flex-row" onClick={selectTask}>
                <div
                    className="project-task-selector"
                    style={{ border: selected && `2px solid ${color}`, backgroundColor: selected && color }}
                />
                <p>{task.name}</p>
                <div className="project-listTask-info flex-row">
                </div>
            </div>
        </C_ContextMenu>
        <C_TaskModal control={_modal} task={task} onSaveTask={updateTask} />
    </>;
}

export default C_List_Task;
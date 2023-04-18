import React, { useState } from "react";
import { C_ContextMenu, C_TaskModal } from '../';
import { useIndexedDB, useModal } from "../../hooks";
import { getDataFromForm } from "../../utils/util";
import { ContextMenuItem } from "../../utils/schemas";

const C_Board_Task = ({ statusList, task, color, selected, updateTask, removeTask, selectTask, deselectTask }) => {

    const [isRenaming, setIsRenaming] = useState(false);
    
    const _modal = useModal();
    const db = useIndexedDB();

    const onSelectTask = (event) => {
        event.stopPropagation();

        if (!selected)
            selectTask(task);
        else
            deselectTask(task);
    }

    const onRenameTask = event => {
        event.preventDefault();
        const { taskName } = getDataFromForm(event.currentTarget);

        const newTask = { ...task, name: taskName };
        db.update('tasks', newTask).then(() => {
            updateTask(newTask);
            setIsRenaming(false);
        });
    }

    const onMovetask = (newStatusID) => {
        const newTask = { ...task, status: newStatusID };
        db.update('tasks', newTask).then(() => {
            updateTask(newTask);
        });
    }

    const taskContextOptions = [
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
                    subOptions: !statusList ? [] : statusList.map(status => new ContextMenuItem({
                        title: status.name,
                        color: 'var(--color-text)',
                        callback: () => { onMovetask(status.id); }
                    }))
                })
            ]
        }),
        new ContextMenuItem({ title: 'Rename', color: 'var(--color-text)', callback: () => { setIsRenaming(true); } }),
        new ContextMenuItem({
            title: 'Delete Task',
            color: 'var(--color-error)',
            callback: () => { 
                db.remove('tasks', task.id).then(() => { removeTask(task); if (selected) deselectTask(task); })
            }
        })
    ]

    if (isRenaming) return <C_Board_NewTaskForm placeholderText={task.name} onSubmit={onRenameTask} onCancel={() => { setIsRenaming(false); }} />;

    return task && <li>
        <C_ContextMenu options={taskContextOptions}>
            <div className="project-board-task flex-column" onClick={onSelectTask}>
                <section className="project-board-task-header flex-row">
                    <div
                        className="project-task-selector"
                        style={{ border: selected && `2px solid ${color}`, backgroundColor: selected && color }}
                    />
                    <p className="project-board-task-name">{task.name}</p>
                </section>
            </div>
        </C_ContextMenu>
        <C_TaskModal control={_modal} task={task} statusList={statusList} onSave={updateTask} />
    </li>;
}

export default C_Board_Task;
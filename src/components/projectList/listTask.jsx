import React, { useState } from "react";
import { C_ContextMenu } from '../';
import C_List_NewTaskForm from "./newTaskForm";

const C_List_Task = ({ task, status, onRenameTask, onSelect, onDeselect, onMoveTask, onDeleteTask }) => {

    const [selected, setSelected] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    const selectTask = () => {

        if (selected)
            onDeselect(task);
        else
            onSelect(task);

        setSelected(!selected);
    }

    const taskOptions = () => {
        return [
            {
                id: 'edit',
                title: 'Edit',
                color: 'var(--color-text)',
                callback: () => { console.log("Editing Task"); }
            },
            {
                id: 'rename',
                title: 'Rename',
                color: 'var(--color-text)',
                callback: () => { setIsRenaming(true); }
            },
            {
                id: 'moveTo',
                title: 'Move To',
                color: 'var(--color-text)',
                callback: () => { console.log("Moving Task"); }
            },
            {
                id: 'delete',
                title: 'Delete Task',
                color: 'var(--color-error)',
                callback: () => { onDeleteTask(task); }
            },
        ]
    }

    return isRenaming
        ? <C_List_NewTaskForm
            placeholderText={task.name}
            onSubmit={(event) => { onRenameTask(event, task); setIsRenaming(false); }}
            onCancel={() => { setIsRenaming(false); }}
        />
        : <C_ContextMenu options={taskOptions()}>
            <div className="project-listTask flex-row" onClick={selectTask}>
            <div
                className="project-task-selector"
                style={{ border: selected && `2px solid ${status.color}`, backgroundColor: selected && status.color }}
            />
            <p>{task.name}</p>
            <div className="project-listTask-info flex-row">
                <p className="small">{task.priority}</p>
                <p className="small">{task.dueDate}</p>
            </div>
        </div>
    </C_ContextMenu>;
}

export default C_List_Task;
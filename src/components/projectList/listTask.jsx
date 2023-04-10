import React, { useState } from "react";
import { C_ContextMenu } from '../';

const C_List_Task = ({ task, color, onSelect, onDeselect, contextOptions }) => {

    const [selected, setSelected] = useState(false);

    const selectTask = (event) => {
        event.stopPropagation();

        if (selected)
            onDeselect(task);
        else
            onSelect(task);

        setSelected(!selected);
    }

    return <C_ContextMenu options={contextOptions}>
            <div className="project-listTask flex-row" onClick={selectTask}>
            <div
                className="project-task-selector"
                style={{ border: selected && `2px solid ${color}`, backgroundColor: selected && color }}
            />
            <p>{task.name}</p>
            <div className="project-listTask-info flex-row">
            </div>
        </div>
    </C_ContextMenu>;
}

export default C_List_Task;
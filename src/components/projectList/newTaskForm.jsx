import React from "react";
import { C_SVG } from '../';

const C_List_NewTaskForm = ({onSubmit, onCancel, placeholderText = "New Task"}) => {
    return <form className="project-listTask-new flex-row" onSubmit={onSubmit}>
        <div className="project-listTask flex-row">
            <input type="text" name="taskName" placeholder={placeholderText} aria-label="New Task Name Input" autoFocus={true} />
        </div>
        <button type="button" onClick={onCancel}>
            <C_SVG sourceURL="/x.svg" size="1rem" color="var(--color-text)" />
        </button>
        <button type="submit">
            <C_SVG sourceURL="/checkmark.svg" size="1rem" color="var(--color-text)" />
        </button>
    </form>
}

export default C_List_NewTaskForm;
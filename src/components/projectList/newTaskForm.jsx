import React from "react";
import { C_SVG } from '../';

const C_List_NewTaskForm = ({ onSubmit, onCancel, placeholderText }) => {
    return <form className="project-listTask-new flex-row" onSubmit={onSubmit}>
        <button type="button" onClick={onCancel}>
            <C_SVG sourceURL="/x.svg" size="1rem" color="var(--color-text)" />
        </button>
        <button type="submit">
            <C_SVG sourceURL="/checkmark.svg" size="1rem" color="var(--color-text)" />
        </button>
        <input type="text" id="taskNameInput" name="taskName"
            placeholder={placeholderText || 'New Task'} defaultValue={placeholderText || ''}
            aria-label="New Task Name Input" autoFocus={true}
        />
    </form>
}

export default C_List_NewTaskForm;
import React from "react";
import { C_Modal, C_SVG } from "../";
import './taskModal.css';
import { getDataFromForm } from "../../utils/util";

const C_TaskModal = ({ control, task, onSaveTask }) => {

    const saveTask = (event) => {

        console.log(event);
        event.preventDefault();

        const { newTaskName } = getDataFromForm(event.currentTarget);

        onSaveTask({
            ...task,
            name: newTaskName
        });
        control.toggle();
    }

    const blurOnEnterPressed = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
            return;
        }
    }

    return task && <C_Modal isOpen={control.isOpen} toggle={control.toggle}>
        <form className="task-modal flex-column" onSubmit={saveTask}>
            <section className="tm-header flex-row">
                <button type="button" onClick={control.toggle}>
                    <C_SVG sourceURL="/x.svg" size="1.25rem" color="var(--color-text)"/>
                </button>
            </section>
            <section className="tm-name flex-row">
                <input type="text" name="newTaskName" id="tm-newTaskName" defaultValue={task.name} placeholder={task.name} aria-label="Task Name" onKeyDown={blurOnEnterPressed}/>
            </section>
            <section className="tm-actions flex-row">
                <button type="submit" className="tm-saveTask">
                    <h5>Save Task</h5>
                </button>
            </section>
        </form>
    </C_Modal>
}

export default C_TaskModal;
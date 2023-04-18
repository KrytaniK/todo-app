import React from "react";
import { C_Modal, C_SVG } from "../";
import './taskModal.css';
import { getDataFromForm } from "../../utils/util";

const C_TaskModal = ({ control, task, statusList, onSave }) => {

    const saveTask = (event) => {
        event.preventDefault();

        const { newTaskName, newTaskStatus } = getDataFromForm(event.currentTarget);

        const newTask = {
            ...task,
            name: newTaskName,
            status: newTaskStatus
        }

        onSave(newTask);
        control.toggle();
    }

    const blurOnEnterPressed = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
            return;
        }
    }

    const initialStatus = statusList.filter(({ id }) => task.status === id)[0];

    return task && <C_Modal isOpen={control.isOpen} toggle={control.toggle}>
        <form className="task-modal flex-column" onSubmit={saveTask}>
            <section className="tm-header flex-row">
                <div className="tm-location flex-row">
                    <p className="small">TODO: Add Task Location</p>
                </div>
                <button type="button" onClick={control.toggle}>
                    <C_SVG sourceURL="/x.svg" size="1.25rem" color="var(--color-text)"/>
                </button>
            </section>
            <section className="tm-name flex-column">
                <label htmlFor="newTaskName">
                    <p className="small">Name</p>
                </label>
                <input
                    type="text" name="newTaskName" id="tm-newTaskName"
                    defaultValue={task.name} placeholder={task.name}
                    aria-label="Task Name"
                    onKeyDown={blurOnEnterPressed}
                />
            </section>
            <section className="tm-status flex-row">
                <label htmlFor="newTaskStatus">
                    <p>Status</p>
                </label>
                <select name="newTaskStatus" id="newTaskStatus" defaultValue={initialStatus.id}>
                    {
                        statusList.map(status => {
                            return <option key={status.id} value={status.id}>{status.name}</option>
                        })
                    }
                </select>
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
import React from "react";
import './statusModal.css';
import {C_SVG, C_Modal} from '../'
import { getDataFromForm } from "../../utils/util";
import { Status } from "../../utils/schemas";
import { useIndexedDB } from "../../hooks";

const C_StatusModal = ({ control, status, onSave }) => {

    const db = useIndexedDB();
    
    const saveStatus = (event) => {
        event.preventDefault();

        const { newStatusColor, newStatusName } = getDataFromForm(event.currentTarget);

        if (!status) {
            const newStatus = new Status({ name: newStatusName, color: newStatusColor });
            db.add('statuses', newStatus).then(() => {
                onSave(newStatus);
                control.toggle();
            });
            return;
        }

        const newStatus = {
            ...status,
            name: newStatusName,
            color: newStatusColor
        }

        db.update('statuses', newStatus).then(() => {
            onSave(newStatus);
            control.toggle();
        });
    }

    const blurOnEnterPressed = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
            return;
        }
    }

    return <C_Modal isOpen={control.isOpen} toggle={control.toggle}>
        <form className="status-modal flex-column" onSubmit={saveStatus}>
            <section className="sm-header flex-row">
                <button type="button" onClick={control.toggle}>
                    <C_SVG sourceURL="/x.svg" size="1.25rem" color="var(--color-text)"/>
                </button>
            </section>
            <section className="sm-name flex-row">
                <label htmlFor="newStatusName">
                    <p className="small">Name</p>
                </label>
                <input type="text" name="newStatusName" id="newStatusName"
                    defaultValue={status?.name ? status.name : "New Status"}
                    placeholder={status?.name ? status.name : "New Status"}
                    onKeyDown={blurOnEnterPressed} />
            </section>
            <section className="sm-attributes">
                <div className="sm-color flex-row">
                    <label htmlFor="newStatusColor">
                        <p className="small">Color</p>
                    </label>
                    <input type="color" name="newStatusColor" id="newStatusColor" defaultValue={status?.color.trim() || '#000000'} />
                </div>
            </section>
            <section className="sm-actions flex-row">
                <button type="submit" className="sm-saveStatus">
                    <p className="small">Save Status</p>
                </button>
            </section>
        </form>
    </C_Modal>
}

export default C_StatusModal;
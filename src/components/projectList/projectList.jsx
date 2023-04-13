import React, { useState } from "react";
import C_List_Status from "./listStatus";
import './projectList.css';

const C_ProjectList = ({ statusList, taskList }) => {

    const [viewedTasks, setViewedTasks] = useState([...taskList]);

    const onTaskStatusChange = (task) => {
        for (let i = 0; i < viewedTasks.length; i++) {
            if (viewedTasks[i].id === task.id) {
                viewedTasks.splice(i, 1, task);
                setViewedTasks([...viewedTasks]);
            }
        }
    }

    return <>
        <section className="project-list-view flex-column">
            <div className="project-list-header flex-row">
                
            </div>
            {statusList && statusList.map((status) => <C_List_Status key={status.id} status={status} taskList={viewedTasks} onTaskStatusChange={onTaskStatusChange} /> )}
        </section>
    </>;
}

export default C_ProjectList;
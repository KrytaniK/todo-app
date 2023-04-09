import React from "react";
import C_List_Status from "./listStatus";
import './projectList.css';

const C_ProjectList = ({ statuses, taskList, taskActions }) => {

    return <>
        <div className="project-list-header">

        </div>
        <section className="project-list-view flex-column">
            {statuses && statuses.map(status => {
                    return <C_List_Status
                        key={status.id}
                        status={status}
                        taskList={taskList}
                        statusList={statuses}
                        taskActions={taskActions}
                />
            })}
        </section>
    </>;
}

export default C_ProjectList;
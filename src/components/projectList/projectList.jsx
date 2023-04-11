import React from "react";
import C_List_Status from "./listStatus";
import {C_Dropdown} from "../";
import './projectList.css';

const C_ProjectList = ({ statuses, selectedTasks, taskList, taskActions }) => {

    return <>
        <section className="project-list-view flex-column">
            <div className="project-list-header flex-row">
                <C_Dropdown
                    id={"selectedTasksDropdown"}
                    title={`${selectedTasks.length} selected tasks`}
                    options={[
                        {
                            id: 'd-moveto',
                            title: 'Move To',
                            color: 'var(--color-text)',
                            options: statuses.map(status => ({
                                id: status.id,
                                title: status.name,
                                color: 'var(--color-text)',
                                callback: () => { taskActions.moveSelectedTasks(status.name); }
                            }))
                        },
                        {
                            id: 'd-deleteall',
                            title: 'Delete All',
                            color: 'var(--color-error)',
                            callback: taskActions.deleteSelectedTasks
                        }
                    ]}
                />
            </div>
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
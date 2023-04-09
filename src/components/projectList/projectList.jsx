import React, { useState } from "react";
import C_List_Status from "./listStatus";
import './projectList.css';
import { useIndexedDB } from "../../hooks";

const C_ProjectList = ({ project }) => {

    const [taskIDs, setTaskIDs] = useState([...project.tasks]);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const db = useIndexedDB();

    const onAddTask = (taskID) => {
        const newProject = {
            ...project,
            tasks: [...taskIDs, taskID]
        }

        db.update('projects', newProject).then(() => {
            setTaskIDs([...newProject.tasks]);
        });
    }

    const onMoveTask = (task, newStatus) => {

    }

    const onDeleteTask = (task) => {
        let index;
        for (let i = 0; i < taskIDs.length; i++) {
            if (taskIDs[i] === task.id) {
                index = i;
                break;
            }
        }

        db.remove('tasks', task.id).then(() => {

            taskIDs.splice(index, 1);

            db.update('projects', {
                ...project,
                tasks: [...taskIDs]
            }).then(() => { setTaskIDs([...taskIDs]); })
        });
    }

    const onSelectTask = (task) => {
        setSelectedTasks([...selectedTasks, task]);
    }

    const onDeselectTask = (task) => {
        let index;
        for (let i = 0; i < selectedTasks.length; i++) {
            if (selectedTasks[i].id === task.id) {
                index = i;
                break;
            }
        }

        selectedTasks.splice(index, 1);
        setSelectedTasks([...selectedTasks]);
    }

    return <section className="project-list-view flex-column">
        {selectedTasks.length > 0 && <div className="selectedTasks flex-row"><h6>{selectedTasks.length} tasks selected</h6></div>}
        {project.statuses && project.statuses.map(status => {
                return <C_List_Status
                    key={status.id}
                    status={status}
                    tasks={taskIDs}
                    onAddTask={onAddTask}
                    onSelectTask={onSelectTask}
                    onDeselectTask={onDeselectTask}
                    onMoveTask={onMoveTask}
                    onDeleteTask={onDeleteTask}
            />
        })}
    </section>;
}

export default C_ProjectList;
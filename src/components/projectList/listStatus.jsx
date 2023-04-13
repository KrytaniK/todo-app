import React, { useEffect, useRef, useState } from "react";
import { C_Collapsible, C_SVG } from "../";
import C_List_Task from "./listTask";
import C_List_NewTaskForm from "./newTaskForm";
import { Task } from "../../utils/schemas";
import { useIndexedDB } from "../../hooks";
import { getDataFromForm } from "../../utils/util";

const C_List_Status = ({ project, status, taskList, onTaskStatusChange, onSelectTask, onDeselectTask }) => {

    const { id, name, color } = status;
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [tasks, setTasks] = useState(undefined);
    
    const db = useIndexedDB();

    useEffect(() => {
        setIsCollapsed(taskList.length === 0 || false);
    }, [status])

    useEffect(() => {
        filterTasks(project.tasks);
    }, [project]);

    useEffect(() => {
        filterTasks(taskList);
    }, [taskList])

    const filterTasks = (_tasks) => {
        const filteredTasks = _tasks.filter((_task) => id === _task.status);
        setTasks([...filteredTasks]);
        setIsCollapsed(!filteredTasks.length);
    }

    const addTaskToStatus = (event) => {
        event.preventDefault();

        const { taskName } = getDataFromForm(event.currentTarget);

        const task = new Task({ name: taskName, status: status.id });

        db.add('tasks', {...task}).then(() => {
            db.update('projects', { ...project, tasks: [...tasks.map(task => task.id), task.id] }).then(() => {
                setTasks([...tasks, task]);
                setIsAddingTask(false);
                if (isCollapsed) setIsCollapsed(false);
            });
        });
    }

    const removeTaskFromStatus = (task) => {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === task.id) {
                tasks.splice(i, 1);
                setTasks([...tasks]);
                return;
            }
        }
    }

    return <section className="project-status">
        <div className="project-status-header flex-row">
            <button className={`expandStatusBtn ${isCollapsed ? 'collapsed' : ''}`} onClick={() => { setIsCollapsed(!isCollapsed); }} >
                <C_SVG sourceURL="/chevron-up.svg" size="1rem" color="var(--color-text)"/>
            </button>
            <h3 style={{ color: color }}>{name}</h3>

            {
                tasks && tasks.length && isCollapsed ? <h6 className="project-status-taskCount">{tasks.filter(task => task.status === id).length} tasks</h6> :
                    <button className="newTaskBtn flex-row" onClick={() => { setIsAddingTask(true); }}>
                        <C_SVG sourceURL="/plus-small.svg" size="1rem" color="var(--color-text)" />
                        <h6>New Task</h6>
                    </button>
            }
        </div>
        <C_Collapsible id={id} isCollapsed={isCollapsed}>
            <ul className="project-status-items flex-column">
                {isAddingTask && <C_List_NewTaskForm onSubmit={addTaskToStatus} onCancel={() => { setIsAddingTask(false); }}/>}
                {tasks && tasks.map(task => {
                    return <C_List_Task
                        key={task.id}
                        taskData={task}
                        color={color}
                        project={project}
                        taskList={tasks}
                        removeTaskFromStatus={removeTaskFromStatus}
                        changeTaskStatus={onTaskStatusChange}
                        onSelectTask={onSelectTask}
                        onDeselectTask={onDeselectTask}
                    />;
                })}
            </ul>
        </C_Collapsible>
        
    </section>
}

export default C_List_Status;

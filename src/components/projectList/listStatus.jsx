import React, { useEffect, useState } from "react";
import { C_SVG } from "../";
import C_List_NewTaskForm from "./newTaskForm";
import { Task } from "../../utils/schemas";
import { useIndexedDB } from "../../hooks";
import C_List_Task from "./listTask";

const C_List_Status = ({ status, tasks, onAddTask, onSelectTask, onDeselectTask, onMoveTask, onDeleteTask }) => {

    const [addingTask, setAddingTask] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const db = useIndexedDB();

    useEffect(() => {

        const getTasks = async () => {
            let result = [];
            for (let id of tasks) {
                const task = await db.get('tasks', id);

                if (task.status != status.id)
                    continue;

                result.push(task);
            }

            return result;
        }

        getTasks().then(tasks => { setTaskList([...tasks]) });
    }, [tasks]);

    const onCreateTask = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const taskName = data['taskName'];

        const newTask = new Task({ name: taskName, status: status.id });
        
        db.add('tasks', newTask).then(() => {
            onAddTask(newTask.id);
        });


        setTaskList([...taskList, newTask]);
        setAddingTask(false);
    }

    const onRenameTask = (event, task) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const newTaskName = data['taskName'];

        if (newTaskName.length < 1) return;

        const newTask = { ...task, name: newTaskName };

        let index;
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id === task.id) {
                index = i;
                break;   
            }
        }

        db.update('tasks', newTask).then(() => {
            taskList.splice(index, 1, newTask);
            setTaskList([...taskList]);
        });
    }

    return <section className="project-status">
        <div className="project-status-header flex-row">
            <button className="expandStatusBtn">
                <C_SVG sourceURL="/chevron-down.svg" size="1rem" color="var(--color-text)"/>
            </button>
            <h3 style={{ color: status.color }}>{status.name}</h3>
            <button className="newTaskBtn flex-row" onClick={() => { setAddingTask(true); }}>
                <C_SVG sourceURL="/plus-small.svg" size="1rem" color="var(--color-text)" />
                <h6>New Task</h6>
            </button>
            <div className="status-descriptors flex-row">
                <h6>Priority</h6>
                <h6>Due Date</h6>
            </div>
        </div>
        <ul className="project-status-items flex-column">
            {addingTask && <C_List_NewTaskForm onSubmit={onCreateTask} onCancel={() => { setAddingTask(false); }} />}
            {taskList && taskList.map((task) => {
                return <C_List_Task
                    key={task.id}
                    task={task}
                    status={status}
                    onSelect={onSelectTask}
                    onDeselect={onDeselectTask}
                    onRenameTask={onRenameTask}
                    onMoveTask={onMoveTask}
                    onDeleteTask={onDeleteTask}
                />;
            })}
        </ul>
    </section>
}

export default C_List_Status;

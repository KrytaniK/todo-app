import { useState, useEffect } from "react";

const useStatus = (statusID, taskList, database) => {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const getTasks = async () => {
            let result = [];
            for (let id of taskList) {
                const task = await database.get('tasks', id);

                if (task.status != statusID)
                    continue;

                result.push(task);
            }
            return result;
        }

        getTasks().then(_tasks => { setTasks([..._tasks]); });
    }, [taskList]);

    const addTask = (task) => {

    }

    const updateTask = (updatedTask) => {

        let index;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === updatedTask.id) {
                index = i;
                break;   
            }
        }

        tasks.splice(index, 1, updatedTask);
        setTasks([...tasks]);
    }

    return {
        tasks,
        addTask,
        updateTask,
    }
}

export default useStatus;
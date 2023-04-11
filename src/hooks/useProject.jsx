import { useState, useEffect } from "react";

const useProject = (projectID, database) => {

    const [project, setProject] = useState(undefined);
    const [taskList, setTaskList] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
        const getProject = async () => {
            database.get('projects', projectID).then(_project => {
                setProject(_project);
                setTaskList([..._project.tasks]);
            })
        }

        getProject();
    }, [projectID]);

    const addTask = (task) => {
        const newProject = {
            ...project,
            tasks: [...taskList, task.id]
        }

        database.update('projects', newProject).then(() => {
            database.add('tasks', task);
            setTaskList([...newProject.tasks]);
        });
    }

    const updateTask = (newTask) => {
        database.update('tasks', newTask).then(() => {
            setTaskList([...taskList]);
        })
    }

    const moveTask = (task, newStatus) => {
        if (task.status === newStatus)
            return;

        updateTask({ ...task, status: newStatus });
    }

    const deleteTask = (task) => {
        let index;
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i] === task.id) {
                index = i;
                break;
            }
        }

        database.remove('tasks', task.id).then(() => {

            taskList.splice(index, 1);

            database.update('projects', {
                ...project,
                tasks: [...taskList]
            }).then(() => { setTaskList([...taskList]); })
        });
    }

    const selectTask = (task) => {
        setSelectedTasks([...selectedTasks, task]);
    }

    const deselectTask = (task) => {
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

    const moveSelectedTasks = (newStatus) => {
        for (let task of selectedTasks) {
            const newTask = { ...task, status: newStatus }
            database.update('tasks', newTask);

            let index;
            for (let i = 0; i < selectedTasks.length; i++) {
                if (selectedTasks[i].id === task.id) {
                    index = i;
                    break;
                }
            }
            taskList.splice(index, 1, newTask);
        }

        setTaskList([...taskList]);
        setSelectedTasks([]);
    }

    const deleteSelectedTasks = async () => {
        for (let task of selectedTasks) {
            await database.remove('tasks', task.id);

            let index;
            for (let i = 0; i < selectedTasks.length; i++) {
                if (selectedTasks[i].id === task.id) {
                    index = i;
                    break;
                }
            }
            taskList.splice(index, 1);
        }

        await database.update('projects', {
            ...project,
            tasks: [...taskList]
        })

        setTaskList([...taskList]);
        setSelectedTasks([]);
    }

    return {
        project,
        taskList,
        selectedTasks,
        taskActions: {
            addTask,
            updateTask,
            moveTask,
            deleteTask,
            selectTask,
            deselectTask,
            moveSelectedTasks,
            deleteSelectedTasks
        }
    }
}

export default useProject;
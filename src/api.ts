import {Task} from './task'

export const fetchAPI = {
        tasks: [
            {id: 1, title: 'firstTask', isCompleted: true},
            {id: 2, title: 'secondTask', isCompleted: false},
            {id: 3, title: 'thirdTask', isCompleted: false},
            {id: 4, title: 'fourthTask', isCompleted: true}
        ] as Task[],

        idCounter: 1,

        async fetchAllTasks(status: string): Promise<Task[]>{
            if(status === 'FAIL') throw new Error('failed to fetch all tasks')
            return this.tasks;
        },

        async fetchLatestTask(status: string): Promise<Task>{
            if(status === 'FAIL') throw new Error('failed to fetch latest task')
            return this.tasks[this.idCounter-1];
        },

        async fetchIncompleteTasks(status: string): Promise<Task[]> {
            if(status === 'FAIL') throw new Error('failed to fetch incomplete tasks')
            return this.tasks.filter((task: Task) => task.isCompleted === false);
        },

        async fetchCompletedTasks(status: string): Promise<Task[]> {
            if(status === 'FAIL') throw new Error('failed to fetch completed tasksx')
            return this.tasks.filter((task: Task) => task.isCompleted === true);
        }
    }
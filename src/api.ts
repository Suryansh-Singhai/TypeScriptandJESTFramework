import {Task} from './task'

export const fetchAPI = {
    async fetchAllTasks(): Promise<Task[]>{
        return [
            {id: 1, title: 'firstTask', isCompleted: true},
            {id: 2, title: 'secondTask', isCompleted: false},
            {id: 3, title: 'thirdTask', isCompleted: false},
            {id: 4, title: 'fourthTask', isCompleted: true}
        ]
    },

    async fetchLatestTask(): Promise<Task>{
        return {id: 4, title: 'fourthTask', isCompleted: true};
    },

    async fetchIncompleteTasks(): Promise<Task[]> {
        return [
            {id: 2, title: 'secondTask', isCompleted: false},
            {id: 3, title: 'thirdTask', isCompleted: false}
        ];
    },

    async fetchCompletedTasks(): Promise<Task[]> {
        return [
            {id: 1, title: 'firstTask', isCompleted: true},
            {id: 4, title: 'fourthTask', isCompleted: true}
        ];
    }
}
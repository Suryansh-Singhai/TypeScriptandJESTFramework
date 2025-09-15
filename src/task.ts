import {logger} from './logger'
import { fetchAPI } from './api';

export interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

export class TaskManager{
    private tasks: Task[] = [];
    private static idCounter: number = 1;
    
    async loadAllTasks(): Promise<Task[]>{
        logger.info('Loading Tasks');
        this.tasks = await fetchAPI.fetchAllTasks();
        return this.tasks;
    }

    async loadLatestTask(): Promise<Task>{
        logger.info('Loading Latest Task');
        const task: Task = await fetchAPI.fetchLatestTask();
        return task;
    }

    async loadCompletedTasks(): Promise<Task[]>{
        logger.info('Loading Completed Tasks');
        const completedTasks: Task[] = await fetchAPI.fetchCompletedTasks();
        return completedTasks;
    
    }
    async loadIncompleteTasks(): Promise<Task[]>{
        logger.info('Loading Incomplete Tasks');
        const incompleteTasks: Task[] = await fetchAPI.fetchIncompleteTasks();
        return incompleteTasks;
    }

    addTask(title: string): void{
        if(typeof title !== 'string') logger.error('title should be a valid string.')
        const task = {id: TaskManager.idCounter++, title, isCompleted: false};
        this.tasks.push(task);
        logger.info(`Task '${title}' added successfully with status Incomplete.`)
    }

    markTaskAsComplete(id: number): void{
        if(typeof id !== 'number') logger.error('id should be a valid number.')
        this.tasks[id].isCompleted = true;
        logger.info(`Marked task ${id} as completed.`)
    }
}
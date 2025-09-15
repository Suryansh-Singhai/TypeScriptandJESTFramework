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
    
    async loadAllTasks(arg: string): Promise<Task[]>{
        try {
            logger.info('Loading Tasks');
            this.tasks = await fetchAPI.fetchAllTasks(arg);
            return this.tasks;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    async loadLatestTask(arg: string): Promise<Task>{
        try {
            logger.info('Loading Latest Task');
            const task: Task = await fetchAPI.fetchLatestTask(arg);
            return task;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }   
    }

    async loadCompletedTasks(arg: string): Promise<Task[]>{
        try {
            logger.info('Loading Completed Tasks');
            const completedTasks: Task[] = await fetchAPI.fetchCompletedTasks(arg);
            return completedTasks;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
        
    }
    async loadIncompleteTasks(arg: string): Promise<Task[]>{
        try {
            logger.info('Loading Incomplete Tasks');
            const incompleteTasks: Task[] = await fetchAPI.fetchIncompleteTasks(arg);
            return incompleteTasks;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
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
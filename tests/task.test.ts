import { TaskManager } from "../src/task";
import { fetchAPI } from "../src/api";
import { logger } from "../src/logger";

jest.mock('../src/api', ()=>(
    {
        fetchAPI: {
            fetchAllTasks: jest.fn(),
            fetchLatestTask: jest.fn(),
            fetchCompletedTasks: jest.fn(),
            fetchIncompleteTasks: jest.fn(),
        }
    }
))

describe('Task Manager - Add and UpdateStatus', ()=>{
    let taskmanager: TaskManager;

    beforeEach(()=>{
        taskmanager = new TaskManager();
        jest.clearAllMocks;
    })

    test('Testing addTask functionality - positive', ()=> {
        const spy = jest.spyOn(logger, 'info');
        taskmanager.addTask('task1');
        expect(spy).toHaveBeenCalled();
        expect(taskmanager.getTaskId('task1')).toEqual(1);
        expect(taskmanager.getTaskStatus('task1')).toEqual(false);
    })

    // test('Testing updateStatus functionality', ()=> {
    //     const spy = jest.spyOn(logger, 'info');
    //     taskmanager.addTask('task1');
    //     expect(taskmanager.getTaskStatus('task1')).toEqual(false);
    //     const id = taskmanager.getTaskId('task1');
    //     taskmanager.markTaskAsComplete(id);
    //     expect(taskmanager.getTaskStatus('task1')).toEqual(true);
    //     expect(spy).toHaveBeenCalled();
    // })
})

describe('Task Manager - Mock APIs', ()=>{
    let taskmanager: TaskManager;

    beforeAll(()=>{
        console.log('Started Task Manager Test Suite')
    })

    beforeEach(()=>{
        taskmanager = new TaskManager();
        jest.clearAllMocks();
    })

    afterEach(()=>{
        jest.restoreAllMocks();
    })

    afterAll(()=>{
        console.log('Finished Task Manager Test Suite')
    })

    test('Loading all Tasks - success', async ()=>{
        const mockTasks = [
            {id: 1, title: 'firstTask', isCompleted: true},
            {id: 2, title: 'secondTask', isCompleted: false},
        ];

        (fetchAPI.fetchAllTasks as jest.Mock).mockResolvedValue(mockTasks);
        const spy = jest.spyOn(logger, 'info');
        const result = await taskmanager.loadAllTasks('TRUE');
        expect(fetchAPI.fetchAllTasks).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockTasks);
    })


    test('Loading all Tasks - failure', async ()=>{
        (fetchAPI.fetchAllTasks as jest.Mock).mockRejectedValue(new Error("failed to fetch all tasks"));
        const spy = jest.spyOn(logger, 'error');
        await expect(taskmanager.loadAllTasks('FAIL')).rejects.toThrow("failed to fetch all tasks");
        expect(fetchAPI.fetchAllTasks).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    })

    test('Loading Latest Task - success', async ()=>{
        const mockLatestTask = 
            {id: 2, title: 'secondTask', isCompleted: false}
        ;

        (fetchAPI.fetchLatestTask as jest.Mock).mockResolvedValue(mockLatestTask);
        const spy = jest.spyOn(logger, 'info');
        const result = await taskmanager.loadLatestTask('TRUE');
        expect(fetchAPI.fetchLatestTask).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockLatestTask);
    })


    test('Loading Latest Task - failure', async ()=>{
        (fetchAPI.fetchLatestTask as jest.Mock).mockRejectedValue(new Error("failed to fetch all tasks"));
        const spy = jest.spyOn(logger, 'error');
        await expect(taskmanager.loadLatestTask('FAIL')).rejects.toThrow("failed to fetch all tasks");
        expect(fetchAPI.fetchLatestTask).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    })

    test('Loading Incomplete Tasks - success', async ()=>{
        const mockTasks = [
            {id: 1, title: 'firstTask', isCompleted: false},
            {id: 2, title: 'secondTask', isCompleted: false},
        ];

        (fetchAPI.fetchIncompleteTasks as jest.Mock).mockResolvedValue(mockTasks);
        const spy = jest.spyOn(logger, 'info');
        const result = await taskmanager.loadIncompleteTasks('TRUE');
        expect(fetchAPI.fetchIncompleteTasks).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockTasks);
    })


    test('Loading Incomplete Tasks - failure', async ()=>{
        (fetchAPI.fetchIncompleteTasks as jest.Mock).mockRejectedValue(new Error("failed to fetch all tasks"));
        const spy = jest.spyOn(logger, 'error');
        await expect(taskmanager.loadIncompleteTasks('FAIL')).rejects.toThrow("failed to fetch all tasks");
        expect(fetchAPI.fetchIncompleteTasks).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    })

    test('Loading Completed Tasks - success', async ()=>{
        const mockTasks = [
            {id: 1, title: 'firstTask', isCompleted: true},
            {id: 2, title: 'secondTask', isCompleted: true},
        ];

        (fetchAPI.fetchCompletedTasks as jest.Mock).mockResolvedValue(mockTasks);
        const spy = jest.spyOn(logger, 'info');
        const result = await taskmanager.loadCompletedTasks('TRUE');
        expect(fetchAPI.fetchCompletedTasks).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockTasks);
    })


    test('Loading completed Tasks - failure', async ()=>{
        (fetchAPI.fetchCompletedTasks as jest.Mock).mockRejectedValue(new Error("failed to fetch all tasks"));
        const spy = jest.spyOn(logger, 'error');
        await expect(taskmanager.loadCompletedTasks('FAIL')).rejects.toThrow("failed to fetch all tasks");
        expect(fetchAPI.fetchCompletedTasks).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    })

})
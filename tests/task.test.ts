import { TaskManager } from "../src/task";
import { fetchAPI } from "../src/api";
import { after, before } from "node:test";
import { logger } from "../src/logger";

jest.mock('../src/api', ()=>(
    {
        fetchAPI: {
            fetchAllTasks: jest.fn(),
            fetchLatestTasks: jest.fn(),
            fetchCompletedTasks: jest.fn(),
            fetchIncompleteTasks: jest.fn(),
        }
    }
))

describe('Task Manager', ()=>{
    let taskmanager: TaskManager;

    before(()=>{
        console.log('Started Task Manager Test Suite')
    })

    beforeEach(()=>{
        taskmanager = new TaskManager();
        jest.clearAllMocks();
    })

    afterEach(()=>{
        jest.restoreAllMocks();
    })

    after(()=>{
        console.log('Finished Task Manager Test Suite')
    })

    test('Loading all Tasks', async ()=>{
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


    test('Loading all Tasks', async ()=>{
        (fetchAPI.fetchAllTasks as jest.Mock).mockRejectedValue(new Error("failed to fetch all tasks"));
        const spy = jest.spyOn(logger, 'error');
        await expect(taskmanager.loadAllTasks('FAIL')).rejects.toThrow("failed to fetch all tasks");
        expect(fetchAPI.fetchAllTasks).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();

    })
    // test('Loading all Tasks', async ()=>{
    //     const mockTasks = [
    //         {id: 1, title: 'firstTask', isCompleted: true},
    //         {id: 2, title: 'secondTask', isCompleted: false},
    //     ];

    //     (fetchAPI.fetchAllTasks as jest.Mock).mockResolvedValue(mockTasks);
    //     const result = await taskmanager.loadAllTasks();
    //     expect(fetchAPI.fetchAllTasks).toHaveBeenCalled();
    //     expect(result).toEqual(mockTasks);
    // })
})
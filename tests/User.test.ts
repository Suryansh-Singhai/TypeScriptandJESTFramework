import { UserService, CreateUserRequest } from '../src/User';
 
describe('UserService', () => {
  let userService: UserService;
 
  beforeEach(() => {
    userService = new UserService();
  });
 
  describe('createUser', () => {
    test('should create a user', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      expect(user.email).toBe('john@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.age).toBe(30);
      expect(user.isActive).toBe(true);
    });
 
    test('should throw error for invalid email', () => {
      expect(() => userService.createUser({
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      })).toThrow('Invalid email address');
    });
 
    test('should throw error for empty first name', () => {
      expect(() => userService.createUser({
        email: 'john@example.com',
        firstName: '',
        lastName: 'Doe',
        age: 30,
      })).toThrow('First name is required');
    });
 
    test('should throw error for invalid age', () => {
      expect(() => userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: -1,
      })).toThrow('Age must be between 0 and 150');
    });
 
    test('should throw error for duplicate email', () => {
      const userData = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      userService.createUser(userData);
      expect(() => userService.createUser(userData)).toThrow('User with this email already exists');
    });
  });
 
  describe('getUserById', () => {
    test('should return user by id', () => {
      const request: CreateUserRequest = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      const user = userService.createUser(request);
      const foundUser = userService.getUserById(user.id);
 
      expect(foundUser).toBe(user);
    });
 
    test('should return null for non-existent user', () => {
      const foundUser = userService.getUserById('non-existent');
      expect(foundUser).toBeNull();
    });
  });
 
  describe('updateUser', () => {
    test('should update user', () => {
      const request: CreateUserRequest = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      const user = userService.createUser(request);
      const updatedUser = userService.updateUser(user.id, { firstName: 'Jane' });
 
      expect(updatedUser.firstName).toBe('Jane');
    });
 
    test('should throw error for non-existent user', () => {
      expect(() => userService.updateUser('non-existent', { firstName: 'Jane' })).toThrow('User not found');
    });
  });
 
  describe('deleteUser', () => {
    test('should delete user', () => {
      const request: CreateUserRequest = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      const user = userService.createUser(request);
      const deleted = userService.deleteUser(user.id);
 
      expect(deleted).toBe(true);
      expect(userService.getUserById(user.id)).toBeNull();
    });
 
    test('should return false for non-existent user', () => {
      const deleted = userService.deleteUser('non-existent');
      expect(deleted).toBe(false);
    });
  });
 
  describe('getAllUsers', () => {
    test('should return all users', () => {
      const request1: CreateUserRequest = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      const request2: CreateUserRequest = {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 25,
      };
 
      userService.createUser(request1);
      userService.createUser(request2);
 
      const users = userService.getAllUsers();
      expect(users).toHaveLength(2);
    });
 
    test('should return empty array when no users', () => {
      const users = userService.getAllUsers();
      expect(users).toHaveLength(0);
    });
  });
 
  describe('findUserByEmail', () => {
    test('should find user by email', () => {
      const request: CreateUserRequest = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };
 
      const user = userService.createUser(request);
      const foundUser = userService.findUserByEmail('john@example.com');
 
      expect(foundUser).toBe(user);
    });
 
    test('should return null for non-existent email', () => {
      const foundUser = userService.findUserByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });
});
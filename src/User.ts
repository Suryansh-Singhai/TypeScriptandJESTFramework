export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
 
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
}
 
export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  isActive?: boolean;
}
 
export class UserService {
  private users: Map<string, User> = new Map();
  private nextId = 1;
 
  private generateId(): string {
    return `user_${this.nextId++}`;
  }
 
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
 
  private validateAge(age: number): boolean {
    return age >= 0 && age <= 150;
  }
 
  createUser(request: CreateUserRequest): User {
    if (!request.email || !this.validateEmail(request.email.trim())) {
      throw new Error('Invalid email address');
    }
 
    if (!request.firstName || request.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
 
    if (!request.lastName || request.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
 
    if (!this.validateAge(request.age)) {
      throw new Error('Age must be between 0 and 150');
    }
 
    const existingUser = this.findUserByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
 
    const now = new Date();
    const user: User = {
      id: this.generateId(),
      email: request.email.toLowerCase().trim(),
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      age: request.age,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
 
    this.users.set(user.id, user);
    return user;
  }
 
  getUserById(id: string): User | null {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }
    return this.users.get(id) || null;
  }
 
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
 
  getActiveUsers(): User[] {
    return this.getAllUsers().filter(user => user.isActive);
  }
 
  updateUser(id: string, request: UpdateUserRequest): User {
    const user = this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
 
    if (request.email !== undefined) {
      if (!this.validateEmail(request.email)) {
        throw new Error('Invalid email address');
      }
      const existingUser = this.findUserByEmail(request.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('User with this email already exists');
      }
      user.email = request.email.toLowerCase().trim();
    }
 
    if (request.firstName !== undefined) {
      if (!request.firstName || request.firstName.trim().length === 0) {
        throw new Error('First name cannot be empty');
      }
      user.firstName = request.firstName.trim();
    }
 
    if (request.lastName !== undefined) {
      if (!request.lastName || request.lastName.trim().length === 0) {
        throw new Error('Last name cannot be empty');
      }
      user.lastName = request.lastName.trim();
    }
 
    if (request.age !== undefined) {
      if (!this.validateAge(request.age)) {
        throw new Error('Age must be between 0 and 150');
      }
      user.age = request.age;
    }
 
    if (request.isActive !== undefined) {
      user.isActive = request.isActive;
    }
 
    user.updatedAt = new Date();
    this.users.set(id, user);
    return user;
  }
 
  deleteUser(id: string): boolean {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }
    return this.users.delete(id);
  }
 
  findUserByEmail(email: string): User | null {
    if (!email || email.trim().length === 0) {
      return null;
    }
    const normalizedEmail = email.toLowerCase().trim();
    return this.getAllUsers().find(user => user.email === normalizedEmail) || null;
  }
 
  getUsersByAgeRange(minAge: number, maxAge: number): User[] {
    if (minAge < 0 || maxAge < 0 || minAge > maxAge) {
      throw new Error('Invalid age range');
    }
    return this.getAllUsers().filter(user => user.age >= minAge && user.age <= maxAge);
  }
 
  getUserCount(): number {
    return this.users.size;
  }
 
  getActiveUserCount(): number {
    return this.getActiveUsers().length;
  }
 
  clear(): void {
    this.users.clear();
    this.nextId = 1;
  }
}
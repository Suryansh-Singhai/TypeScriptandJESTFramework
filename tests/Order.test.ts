import { OrderService, CreateOrderRequest, OrderStatus } from '../src/Order';
import { UserService } from '../src/User';
import { ProductService} from '../src/Product'
 
describe('OrderService', () => {
  let orderService: OrderService;
  let userService: UserService;
  let productService: ProductService;
 
  beforeEach(() => {
    userService = new UserService();
    productService = new ProductService();
    orderService = new OrderService(userService, productService);
  });
 
  describe('createOrder', () => {
    test('should create an order', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const order = orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 2 }],
      });
 
      expect(order.userId).toBe(user.id);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe(product.id);
      expect(order.items[0].quantity).toBe(2);
      expect(order.totalAmount).toBe(2000);
      expect(order.status).toBe(OrderStatus.PENDING);
    });
 
    test('should throw error for non-existent user', () => {
      expect(() => orderService.createOrder({
        userId: 'non-existent',
        items: [{ productId: 'product-1', quantity: 1 }],
      })).toThrow('User not found');
    });
 
    test('should throw error for inactive user', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      userService.updateUser(user.id, { isActive: false });
 
      expect(() => orderService.createOrder({
        userId: user.id,
        items: [{ productId: 'product-1', quantity: 1 }],
      })).toThrow('Cannot create order for inactive user');
    });
 
    test('should throw error for non-existent product', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      expect(() => orderService.createOrder({
        userId: user.id,
        items: [{ productId: 'non-existent', quantity: 1 }],
      })).toThrow('Product with ID non-existent not found');
    });
 
    test('should throw error for insufficient stock', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 1,
      });
 
      expect(() => orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 5 }],
      })).toThrow('Insufficient stock for product Laptop. Available: 1, Requested: 5');
    });
 
    test('should throw error for invalid quantity', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      expect(() => orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 0 }],
      })).toThrow('Quantity must be a positive integer');
    });
  });
 
  describe('getOrderById', () => {
    test('should return order by id', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const order = orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      const foundOrder = orderService.getOrderById(order.id);
      expect(foundOrder).toBe(order);
    });
 
    test('should return null for non-existent order', () => {
      const foundOrder = orderService.getOrderById('non-existent');
      expect(foundOrder).toBeNull();
    });
  });
 
  describe('confirmOrder', () => {
    test('should confirm pending order', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const request: CreateOrderRequest = {
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      };
 
      const order = orderService.createOrder(request);
      const confirmedOrder = orderService.confirmOrder(order.id);
 
      expect(confirmedOrder.status).toBe(OrderStatus.CONFIRMED);
    });
 
    test('should allow confirming already confirmed order', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const request: CreateOrderRequest = {
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      };
 
      const order = orderService.createOrder(request);
      orderService.confirmOrder(order.id);
      const confirmedAgain = orderService.confirmOrder(order.id);
 
      expect(confirmedAgain.status).toBe(OrderStatus.CONFIRMED);
    });
  });
 
  describe('cancelOrder', () => {
    test('should cancel pending order', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const request: CreateOrderRequest = {
        userId: user.id,
        items: [{ productId: product.id, quantity: 2 }],
      };
 
      const order = orderService.createOrder(request);
      const cancelledOrder = orderService.cancelOrder(order.id);
 
      expect(cancelledOrder.status).toBe(OrderStatus.CANCELLED);
 
      const updatedProduct = productService.getProductById(product.id);
      expect(updatedProduct?.stockQuantity).toBe(10);
    });
 
    test('should throw error for non-pending order', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const request: CreateOrderRequest = {
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      };
 
      const order = orderService.createOrder(request);
      orderService.confirmOrder(order.id);
 
      expect(() => orderService.cancelOrder(order.id)).toThrow('Can only cancel pending orders');
    });
  });
 
  describe('getAllOrders', () => {
    test('should return all orders', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 2 }],
      });
 
      const orders = orderService.getAllOrders();
      expect(orders).toHaveLength(2);
    });
 
    test('should return empty array when no orders', () => {
      const orders = orderService.getAllOrders();
      expect(orders).toHaveLength(0);
    });
  });
 
  describe('getOrdersByUserId', () => {
    test('should return orders for specific user', () => {
      const user1 = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const user2 = userService.createUser({
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 25,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      orderService.createOrder({
        userId: user1.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      orderService.createOrder({
        userId: user2.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      const user1Orders = orderService.getOrdersByUserId(user1.id);
      expect(user1Orders).toHaveLength(1);
      expect(user1Orders[0].userId).toBe(user1.id);
    });
  });
 
  describe('getOrdersByStatus', () => {
    test('should return orders by status', () => {
      const user = userService.createUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
 
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      const order1 = orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      orderService.createOrder({
        userId: user.id,
        items: [{ productId: product.id, quantity: 1 }],
      });
 
      orderService.confirmOrder(order1.id);
 
      const pendingOrders = orderService.getOrdersByStatus(OrderStatus.PENDING);
      const confirmedOrders = orderService.getOrdersByStatus(OrderStatus.CONFIRMED);
 
      expect(pendingOrders).toHaveLength(1);
      expect(confirmedOrders).toHaveLength(1);
    });
  });
});
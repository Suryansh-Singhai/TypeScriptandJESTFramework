import { ProductService } from "./Product";
import { UserService } from "./User";

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}
 
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
 
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
 
export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
 
export interface UpdateOrderRequest {
  status?: OrderStatus;
}
 
export class OrderService {
  private orders: Map<string, Order> = new Map();
  private nextId = 1;
 
  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}
 
  private generateId(): string {
    return `order_${this.nextId++}`;
  }
 
  private validateOrderItems(items: Omit<OrderItem, 'unitPrice'>[]): void {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
 
    for (const item of items) {
      if (!item.productId || item.productId.trim().length === 0) {
        throw new Error('Product ID is required for all items');
      }
 
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error('Quantity must be a positive integer');
      }
 
      const product = this.productService.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
 
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
 
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
      }
    }
  }
 
  createOrder(request: CreateOrderRequest): Order {
    if (!request.userId || request.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
 
    const user = this.userService.getUserById(request.userId);
    if (!user) {
      throw new Error('User not found');
    }
 
    if (!user.isActive) {
      throw new Error('Cannot create order for inactive user');
    }
 
    this.validateOrderItems(request.items);
 
    const orderItems: OrderItem[] = request.items.map(item => {
      const product = this.productService.getProductById(item.productId)!;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });
 
    const totalAmount = orderItems.reduce((total, item) =>
      total + (item.quantity * item.unitPrice), 0
    );
 
    const now = new Date();
    const order: Order = {
      id: this.generateId(),
      userId: request.userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
 
    for (const item of orderItems) {
      this.productService.reduceStock(item.productId, item.quantity);
    }
 
    this.orders.set(order.id, order);
    return order;
  }
 
  getOrderById(id: string): Order | null {
    if (!id || id.trim().length === 0) {
      throw new Error('Order ID is required');
    }
    return this.orders.get(id) || null;
  }
 
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }
 
  getOrdersByUserId(userId: string): Order[] {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    return this.getAllOrders().filter(order => order.userId === userId);
  }
 
  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getAllOrders().filter(order => order.status === status);
  }
 
  updateOrder(id: string, request: UpdateOrderRequest): Order {
    const order = this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }
 
    if (request.status !== undefined) {
      if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
        throw new Error('Cannot update delivered or cancelled orders');
      }
 
      if (request.status === OrderStatus.CANCELLED && order.status !== OrderStatus.PENDING) {
        throw new Error('Can only cancel pending orders');
      }
 
      if (request.status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const product = this.productService.getProductById(item.productId);
          if (product) {
            this.productService.updateStock(item.productId, product.stockQuantity + item.quantity);
          }
        }
      }
 
      order.status = request.status;
    }
 
    order.updatedAt = new Date();
    this.orders.set(id, order);
    return order;
  }
 
  cancelOrder(id: string): Order {
    return this.updateOrder(id, { status: OrderStatus.CANCELLED });
  }
 
  confirmOrder(id: string): Order {
    return this.updateOrder(id, { status: OrderStatus.CONFIRMED });
  }
 
  shipOrder(id: string): Order {
    const order = this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }
 
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error('Can only ship confirmed orders');
    }
 
    return this.updateOrder(id, { status: OrderStatus.SHIPPED });
  }
 
  deliverOrder(id: string): Order {
    const order = this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }
 
    if (order.status !== OrderStatus.SHIPPED) {
      throw new Error('Can only deliver shipped orders');
    }
 
    return this.updateOrder(id, { status: OrderStatus.DELIVERED });
  }
 
  deleteOrder(id: string): boolean {
    const order = this.getOrderById(id);
    if (order && order.status === OrderStatus.PENDING) {
      for (const item of order.items) {
        const product = this.productService.getProductById(item.productId);
        if (product) {
          this.productService.updateStock(item.productId, product.stockQuantity + item.quantity);
        }
      }
    }
 
    if (!id || id.trim().length === 0) {
      throw new Error('Order ID is required');
    }
    return this.orders.delete(id);
  }
 
  getOrderCount(): number {
    return this.orders.size;
  }
 
  getTotalRevenue(): number {
    return this.getAllOrders()
      .filter(order => order.status === OrderStatus.DELIVERED)
      .reduce((total, order) => total + order.totalAmount, 0);
  }
 
  getPendingOrdersValue(): number {
    return this.getOrdersByStatus(OrderStatus.PENDING)
      .reduce((total, order) => total + order.totalAmount, 0);
  }
 
  getAverageOrderValue(): number {
    const orders = this.getAllOrders();
    if (orders.length === 0) return 0;
    
    const totalValue = orders.reduce((total, order) => total + order.totalAmount, 0);
    return totalValue / orders.length;
  }
 
  clear(): void {
    this.orders.clear();
    this.nextId = 1;
  }
}
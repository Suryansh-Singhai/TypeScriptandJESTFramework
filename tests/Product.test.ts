import { ProductService, CreateProductRequest } from "../src/Product"; 
 
describe('ProductService', () => {
  let productService: ProductService;
 
  beforeEach(() => {
    productService = new ProductService();
  });
 
  describe('createProduct', () => {
    test('should create a product', () => {
      const product = productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      });
 
      expect(product.name).toBe('Laptop');
      expect(product.description).toBe('Gaming laptop');
      expect(product.price).toBe(1000);
      expect(product.category).toBe('Electronics');
      expect(product.stockQuantity).toBe(10);
      expect(product.isAvailable).toBe(true);
    });
 
    test('should throw error for empty name', () => {
      expect(() => productService.createProduct({
        name: '',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      })).toThrow('Product name is required');
    });
 
    test('should throw error for negative price', () => {
      expect(() => productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: -100,
        category: 'Electronics',
        stockQuantity: 10,
      })).toThrow('Price must be a non-negative number');
    });
 
    test('should throw error for negative stock', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: -5,
      };
 
      expect(() => productService.createProduct(request)).toThrow('Stock quantity must be a non-negative integer');
    });
 
    test('should throw error for duplicate name', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      productService.createProduct(request);
      expect(() => productService.createProduct(request)).toThrow('Product with this name already exists');
    });
  });
 
  describe('getProductById', () => {
    test('should return product by id', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const product = productService.createProduct(request);
      const foundProduct = productService.getProductById(product.id);
 
      expect(foundProduct).toBe(product);
    });
 
    test('should return null for non-existent product', () => {
      const foundProduct = productService.getProductById('non-existent');
      expect(foundProduct).toBeNull();
    });
  });
 
  describe('updateProduct', () => {
    test('should update product', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const product = productService.createProduct(request);
      const updatedProduct = productService.updateProduct(product.id, { price: 900 });
 
      expect(updatedProduct.price).toBe(900);
    });
 
    test('should throw error for non-existent product', () => {
      expect(() => productService.updateProduct('non-existent', { price: 900 })).toThrow('Product not found');
    });
  });
 
  describe('updateStock', () => {
    test('should update stock quantity', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const product = productService.createProduct(request);
      const updatedProduct = productService.updateStock(product.id, 15);
 
      expect(updatedProduct.stockQuantity).toBe(15);
    });
 
    test('should throw error for insufficient stock', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 5,
      };
 
      const product = productService.createProduct(request);
      expect(() => productService.reduceStock(product.id, 10)).toThrow('Insufficient stock');
    });
  });
 
  describe('deleteProduct', () => {
    test('should delete product', () => {
      const request: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const product = productService.createProduct(request);
      const deleted = productService.deleteProduct(product.id);
 
      expect(deleted).toBe(true);
      expect(productService.getProductById(product.id)).toBeNull();
    });
 
    test('should return false for non-existent product', () => {
      const deleted = productService.deleteProduct('non-existent');
      expect(deleted).toBe(false);
    });
  });
 
  describe('getAllProducts', () => {
    test('should return all products', () => {
      const request1: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const request2: CreateProductRequest = {
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 30,
        category: 'Electronics',
        stockQuantity: 50,
      };
 
      productService.createProduct(request1);
      productService.createProduct(request2);
 
      const products = productService.getAllProducts();
      expect(products).toHaveLength(2);
    });
 
    test('should return empty array when no products', () => {
      const products = productService.getAllProducts();
      expect(products).toHaveLength(0);
    });
  });
 
  describe('getAvailableProducts', () => {
    test('should return only available products', () => {
      const request1: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const request2: CreateProductRequest = {
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 30,
        category: 'Electronics',
        stockQuantity: 0,
      };
 
      productService.createProduct(request1);
      productService.createProduct(request2);
 
      const availableProducts = productService.getAvailableProducts();
      expect(availableProducts).toHaveLength(1);
      expect(availableProducts[0].name).toBe('Laptop');
    });
  });
 
  describe('getProductsByCategory', () => {
    test('should return products by category', () => {
      const request1: CreateProductRequest = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        category: 'Electronics',
        stockQuantity: 10,
      };
 
      const request2: CreateProductRequest = {
        name: 'Book',
        description: 'Programming book',
        price: 40,
        category: 'Books',
        stockQuantity: 20,
      };
 
      productService.createProduct(request1);
      productService.createProduct(request2);
 
      const electronics = productService.getProductsByCategory('Electronics');
      expect(electronics).toHaveLength(1);
      expect(electronics[0].name).toBe('Laptop');
    });
  });
});
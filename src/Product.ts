export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
 
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
}
 
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stockQuantity?: number;
  isAvailable?: boolean;
}
 
export class ProductService {
  private products: Map<string, Product> = new Map();
  private nextId = 1;
 
  private generateId(): string {
    return `product_${this.nextId++}`;
  }
 
  private validatePrice(price: number): boolean {
    return price >= 0;
  }
 
  private validateStockQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity >= 0;
  }
 
  createProduct(request: CreateProductRequest): Product {
    if (!request.name || request.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
 
    if (!request.description || request.description.trim().length === 0) {
      throw new Error('Product description is required');
    }
 
    if (!this.validatePrice(request.price)) {
      throw new Error('Price must be a non-negative number');
    }
 
    if (!request.category || request.category.trim().length === 0) {
      throw new Error('Product category is required');
    }
 
    if (!this.validateStockQuantity(request.stockQuantity)) {
      throw new Error('Stock quantity must be a non-negative integer');
    }
 
    const existingProduct = this.findProductByName(request.name);
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
 
    const now = new Date();
    const product: Product = {
      id: this.generateId(),
      name: request.name.trim(),
      description: request.description.trim(),
      price: request.price,
      category: request.category.trim(),
      stockQuantity: request.stockQuantity,
      isAvailable: request.stockQuantity > 0,
      createdAt: now,
      updatedAt: now,
    };
 
    this.products.set(product.id, product);
    return product;
  }
 
  getProductById(id: string): Product | null {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }
    return this.products.get(id) || null;
  }
 
  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }
 
  getAvailableProducts(): Product[] {
    return this.getAllProducts().filter(product => product.isAvailable && product.stockQuantity > 0);
  }
 
  updateProduct(id: string, request: UpdateProductRequest): Product {
    const product = this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
 
    if (request.name !== undefined) {
      if (!request.name || request.name.trim().length === 0) {
        throw new Error('Product name cannot be empty');
      }
      const existingProduct = this.findProductByName(request.name);
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('Product with this name already exists');
      }
      product.name = request.name.trim();
    }
 
    if (request.description !== undefined) {
      if (!request.description || request.description.trim().length === 0) {
        throw new Error('Product description cannot be empty');
      }
      product.description = request.description.trim();
    }
 
    if (request.price !== undefined) {
      if (!this.validatePrice(request.price)) {
        throw new Error('Price must be a non-negative number');
      }
      product.price = request.price;
    }
 
    if (request.category !== undefined) {
      if (!request.category || request.category.trim().length === 0) {
        throw new Error('Product category cannot be empty');
      }
      product.category = request.category.trim();
    }
 
    if (request.stockQuantity !== undefined) {
      if (!this.validateStockQuantity(request.stockQuantity)) {
        throw new Error('Stock quantity must be a non-negative integer');
      }
      product.stockQuantity = request.stockQuantity;
      if (request.isAvailable === undefined) {
        product.isAvailable = request.stockQuantity > 0;
      }
    }
 
    if (request.isAvailable !== undefined) {
      product.isAvailable = request.isAvailable;
    }
 
    product.updatedAt = new Date();
    this.products.set(id, product);
    return product;
  }
 
  deleteProduct(id: string): boolean {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }
    return this.products.delete(id);
  }
 
  findProductByName(name: string): Product | null {
    if (!name || name.trim().length === 0) {
      return null;
    }
    const normalizedName = name.trim().toLowerCase();
    return this.getAllProducts().find(product => 
      product.name.toLowerCase() === normalizedName
    ) || null;
  }
 
  getProductsByCategory(category: string): Product[] {
    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }
    const normalizedCategory = category.trim().toLowerCase();
    return this.getAllProducts().filter(product => 
      product.category.toLowerCase() === normalizedCategory
    );
  }
 
  getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
      throw new Error('Invalid price range');
    }
    return this.getAllProducts().filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }
 
  updateStock(id: string, quantity: number): Product {
    if (!this.validateStockQuantity(quantity)) {
      throw new Error('Stock quantity must be a non-negative integer');
    }
    
    return this.updateProduct(id, { stockQuantity: quantity });
  }
 
  reduceStock(id: string, quantity: number): Product {
    const product = this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
 
    if (!this.validateStockQuantity(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
 
    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
 
    return this.updateStock(id, product.stockQuantity - quantity);
  }
 
  getProductCount(): number {
    return this.products.size;
  }
 
  getAvailableProductCount(): number {
    return this.getAvailableProducts().length;
  }
 
  getTotalStockValue(): number {
    return this.getAllProducts().reduce((total, product) => 
      total + (product.price * product.stockQuantity), 0
    );
  }
 
  clear(): void {
    this.products.clear();
    this.nextId = 1;
  }
}
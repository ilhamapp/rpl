import { db } from "./db";
import {
  products,
  type Product,
  type InsertProduct,
  type CreateProductRequest,
  type UpdateProductRequest
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: CreateProductRequest): Promise<Product>;
  updateProduct(id: number, updates: UpdateProductRequest): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: CreateProductRequest): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: UpdateProductRequest): Promise<Product> {
    const [updated] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();

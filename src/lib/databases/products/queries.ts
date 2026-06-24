import { db } from "./products.server";

// Das Interface für die Eingabe (z.B. aus einem Formular)
export interface ProductData {
  slug: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  sizes?: string[];  // Als echtes Array
  colors?: string[]; // Neu: Als echtes Array
  category?: string;
}

// Der Typ, wie die Daten direkt aus der SQLite kommen (Strings)
export type ProductRow = {
  id: number;
  slug: string;
  title: string;
  price: number;
  image: string;
  description: string | null;
  sizes: string | null;  // In DB als JSON-String gespeichert
  colors: string | null; // In DB als JSON-String gespeichert
  category: string;
  active: number;
};

export function createProduct(data: ProductData) {
  const stmt = db.prepare(`
    INSERT INTO products (slug, title, price, image, description, sizes, colors, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.slug,
    data.title,
    data.price,
    data.image,
    data.description ?? null,
    data.sizes ? JSON.stringify(data.sizes) : JSON.stringify([]),
    data.colors ? JSON.stringify(data.colors) : JSON.stringify([]),
    data.category ?? 'all'
  );
}

export function getAllProducts() {
  const stmt = db.prepare("SELECT * FROM products WHERE active = 1 ORDER BY id ASC");
  const rows = stmt.all() as ProductRow[];

  return rows.map((row) => ({
    ...row,
    sizes: row.sizes ? JSON.parse(row.sizes) : [],
    colors: row.colors ? JSON.parse(row.colors) : []
  }));
}

export function getProductBySlug(slug: string) {
  const stmt = db.prepare("SELECT * FROM products WHERE slug = ? AND active = 1");
  const row = stmt.get(slug) as ProductRow | undefined;

  if (!row) return null;

  return {
    ...row,
    sizes: row.sizes ? JSON.parse(row.sizes) : [],
    colors: row.colors ? JSON.parse(row.colors) : []
  };
}
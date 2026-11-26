import { pool } from "../config/db.js";
// Importamos el esquema de validación Zod para el alta de productos (Jornada 2)
import { createProductSchema } from "../schemas/productSchema.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, price, image FROM products ORDER BY id DESC"
    );
    // NUMERIC llega como string desde pg: lo convertimos a número
    const data = rows.map((p) => ({ ...p, price: Number(p.price) }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error en getProducts:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// POST /api/products (Jornada 2 - HU02: Registrar un producto)
export const createProduct = async (req, res) => {
  // Validamos el cuerpo de la petición usando el esquema de Zod
  const parsed = createProductSchema.safeParse(req.body);

  // Si algún campo falla la validación, respondemos 400 sin tocar la base de datos
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Datos de producto inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  // Extraemos los datos ya limpios (con trim aplicado y precio convertido a número)
  const { name, price, image } = parsed.data;

  try {
    // Insertamos usando consulta parametrizada ($1, $2, $3) para evitar inyección SQL
    const { rows } = await pool.query(
      "INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING id, name, price, image",
      [name, price, image]
    );

    // Convertimos NUMERIC a número antes de responder con código 201 (Created)
    const data = { ...rows[0], price: Number(rows[0].price) };
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Error en createProduct:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT id, name, price, image FROM products WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: { ...rows[0], price: Number(rows[0].price) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }
const result = createProductSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({
    success: false,
    message: "Datos de producto inválidos",
    errors: result.error.flatten().fieldErrors,
  });
}
  const { name, price, image } = result.data;
  try {
    const { rows } = await pool.query(
      "UPDATE products SET name = $1, price = $2, image = $3 WHERE id = $4 RETURNING id, name, price, image",
      [name, price, image, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: { ...rows[0], price: Number(rows[0].price) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar el producto" });
  }
};
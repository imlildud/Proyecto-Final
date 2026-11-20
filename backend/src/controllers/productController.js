import { pool } from "../config/db.js";

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

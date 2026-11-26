import { Router } from "express";
// Agregamos createProduct a la importación existente
import { getProducts, createProduct, getProductById, updateProduct } from "../controllers/productController.js";
const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
// Ruta para registrar un nuevo producto (Jornada 2)
router.post("/", createProduct);

export default router;
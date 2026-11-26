import { Router } from "express";
// Agregamos createProduct a la importación existente
import { getProducts, createProduct } from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
// Ruta para registrar un nuevo producto (Jornada 2)
router.post("/", createProduct);

export default router;
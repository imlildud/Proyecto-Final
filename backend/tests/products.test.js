import "dotenv/config";
import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";

describe("API /api/products - Jornada 2 (HU02 Alta)", () => {
  let createdProductId;

  afterAll(async () => {
    if (createdProductId) {
      await pool.query("DELETE FROM products WHERE id = $1", [createdProductId]);
    }
    await pool.end();
  });

  // Caso de aceptación 1: Alta válida responde 201 y limpia espacios en el nombre
  test("POST /api/products - Crear un producto válido y responder 201", async () => {
    const newProduct = {
      name: "  Teclado Mecánico RGB  ",
      price: 1299.5,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    };

    const res = await request(app).post("/api/products").send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Teclado Mecánico RGB");
    expect(res.body.data.price).toBe(1299.5);

    createdProductId = res.body.data.id;
  });

  // Caso de aceptación 2: Precio inválido responde 400 y no guarda en la BD
  test("POST /api/products - Rechaza el preciocon 400, por ser negativo", async () => {
    const invalidProduct = {
      name: "Mouse Gamer",
      price: -50,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    };

    const res = await request(app).post("/api/products").send(invalidProduct);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Caso adicional: URL de imagen inválida responde 400
  test("POST /api/products - Rechaza URL inválida con 400, no es el formato URL", async () => {
    const invalidUrlProduct = {
      name: "Monitor 24",
      price: 3500,
      image: "no-es-una-url",
    };

    const res = await request(app).post("/api/products").send(invalidUrlProduct);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
import "dotenv/config";
import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";

const valido = {
  name: "Producto prueba HU03",
  price: 150,
  image: "https://picsum.photos/seed/test/400/300",
};

// Id del producto creado en la prueba de alta; se declara aquí para limpiarlo al final
let createdProductId;

// Se ejecuta una sola vez, cuando terminan TODAS las pruebas del archivo.
// Antes estaba dentro del primer describe y cerraba el pool antes de las pruebas de PUT.
afterAll(async () => {
  if (createdProductId) {
    await pool.query("DELETE FROM products WHERE id = $1", [createdProductId]);
  }
  await pool.end();
});

describe("API /api/products - Jornada 2 (HU02 Alta)", () => {
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

describe("PUT /api/products/:id", () => {
  it("ID inexistente responde 404", async () => {
    const res = await request(app).put("/api/products/999999").send(valido);
    expect(res.status).toBe(404);
  });

  it("edición válida responde 200 y persiste", async () => {
    const creado = await request(app).post("/api/products").send(valido);
    const id = creado.body.data.id;
    const res = await request(app)
      .put(`/api/products/${id}`)
      .send({ ...valido, name: "Nombre editado" });
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/products/${id}`);
    expect(check.body.data.name).toBe("Nombre editado");
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
  });
});
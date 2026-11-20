// Ejecuta sql/schema.sql contra la BD (multiplataforma, sin depender de psql)
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL. Crea backend/.env (copia de .env.example).");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, "../sql/schema.sql"), "utf8");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query("SELECT COUNT(*)::int AS total FROM products");
  console.log(`Esquema aplicado. Productos en la tabla: ${rows[0].total}`);
} catch (err) {
  console.error("No se pudo preparar la base de datos:", err.message);
  if (err.code === "3D000")
    console.error('La base no existe. Revisa el nombre y las mayúsculas (prueba en minúsculas: proyecto_is).');
  if (err.code === "ECONNREFUSED")
    console.error("No hay conexión: revisa que el contenedor postgres-adminbd esté corriendo en el puerto 5433.");
  if (err.code === "28P01")
    console.error("Usuario o contraseña incorrectos en DATABASE_URL.");
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}

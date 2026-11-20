import "dotenv/config";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error(
    "Falta DATABASE_URL. Crea el archivo backend/.env (copia de .env.example) y reinicia."
  );
  process.exit(1);
}

// Pool de conexiones. Para Neon (Jornada 5) basta cambiar DATABASE_URL
// (y agregar ?sslmode=require) o reemplazar este archivo por @neondatabase/serverless.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

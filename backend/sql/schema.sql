-- Esquema del catalogo (HU01)
CREATE TABLE IF NOT EXISTS products (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255)  NOT NULL,
  price      NUMERIC(10,2) NOT NULL CHECK (price > 0),
  image      TEXT          NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Datos ficticios de ejemplo (solo si la tabla esta vacia)
INSERT INTO products (name, price, image)
SELECT 'Teclado mecánico', 899.00, 'https://picsum.photos/seed/teclado/400/300'
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO products (name, price, image)
SELECT 'Mouse inalámbrico', 349.50, 'https://picsum.photos/seed/mouse/400/300'
WHERE (SELECT COUNT(*) FROM products) = 1;

# Entrega 1 — HU01 Consultar catálogo (Jornada 1)

## Flujo de la consulta
1. Al abrir la página, `App.jsx` ejecuta `fetchProducts()` del store de Zustand.
2. El store hace `axios.get("/api/products")` (Vite redirige /api a Express en el puerto 5000).
3. Express recibe la petición en `productRoutes.js` y la delega a `getProducts` en el controlador.
4. El controlador ejecuta `SELECT id, name, price, image FROM products` con el pool de `pg`.
5. PostgreSQL devuelve las filas; el controlador convierte `price` a número y responde `200 { success: true, data: [...] }`.
6. El store guarda `products`; React renderiza una `ProductCard` por producto, o el estado vacío si `data` es `[]`.

## Evidencia a capturar
- [ ] Postman: GET http://localhost:5000/api/products con 2 productos → 200 y `data` con 2 elementos.
- [ ] Postman: con la tabla vacía (`DELETE FROM products;` en pgAdmin) → 200 y `data: []`.
- [ ] React mostrando los 2 productos.
- [ ] React mostrando el estado vacío.
- [ ] Captura del tablero con HU01 y enlace a la rama/PR y commit.

## Texto sugerido para la tarjeta HU01 (GitHub Projects)
- Responsable: ___  | Jornada: 1
- Criterios: con 2 productos la API responde 200 y React muestra ambos; con tabla vacía 200 con lista vacía y estado vacío en la vista.
- Subtareas: configurar entorno · script SQL · GET /api/products · probar en Postman · vista React con Axios · estado vacío.
- Rama/PR: ___  | Etiqueta: u4-j1

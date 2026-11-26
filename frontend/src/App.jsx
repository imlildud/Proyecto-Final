import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useProductStore } from "./store/useProductStore";
import ProductCard from "./components/ProductCard";
// Importamos el formulario de alta de algun producto
import ProductForm from "./components/ProductForm";
// Importamos la pantalla de edición de un producto (Jornada 3)
import ProductPage from "./components/ProductPage";

// Pantalla principal: catálogo de productos y formulario de alta
function Home() {
  const { products, loading, error, fetchProducts } = useProductStore();
  // Estado local para mostrar u ocultar el formulario de nuevo producto
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow px-6 justify-between">
        <h1 className="text-2xl font-bold">🛒 Catálogo de productos</h1>
        {/* Botón para abrir/cerrar el formulario de registro (HU02) */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cerrar formulario" : "+ Nuevo producto"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Formulario desplegable para dar de alta un producto*/}
        {showForm && (
          <div className="card bg-base-100 shadow-md p-6 mb-6 max-w-lg mx-auto">
            <h2 className="text-lg font-bold mb-4">Registrar nuevo producto</h2>
            <ProductForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
            <button className="btn btn-sm" onClick={fetchProducts}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 text-base-content/60">
            <p className="text-xl">Aún no hay productos en el catálogo.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    // Rutas de la aplicación: catálogo en "/" y edición de un producto en "/product/:id" (Jornada 3)
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}
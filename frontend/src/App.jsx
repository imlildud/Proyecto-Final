import { useEffect } from "react";
import { useProductStore } from "./store/useProductStore";
import ProductCard from "./components/ProductCard";

export default function App() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow px-6">
        <h1 className="text-2xl font-bold">🛒 Catálogo de productos</h1>
      </header>

      <main className="max-w-6xl mx-auto p-6">
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

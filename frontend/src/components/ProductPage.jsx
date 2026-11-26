import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

// Pantalla de edición de un producto (Jornada 3 - HU03)
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchProductById = useProductStore((s) => s.fetchProductById);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Cargamos el producto por ID para precargar el formulario
  useEffect(() => {
    (async () => {
      const result = await fetchProductById(id);
      if (result.success) {
        const { name, price, image } = result.data;
        setForm({ name, price, image });
      } else {
        // Si el ID no existe (404) o falla la carga, mostramos el error
        setNotFound(true);
        setError(result.message);
      }
      setLoading(false);
    })();
  }, [id, fetchProductById]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Guardamos el formulario completo; si falla, el catálogo conserva el último dato confirmado
  const handleSave = async () => {
    setError("");
    const result = await updateProduct(Number(id), {
      name: form.name,
      price: form.price,
      image: form.image,
    });
    if (result.success) {
      navigate("/");
    } else {
      const first = result.fieldErrors
        ? Object.values(result.fieldErrors).flat()[0]
        : null;
      setError(first || result.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="card bg-base-100 shadow-md p-6 max-w-lg mx-auto">
        <Link to="/" className="link mb-4">← Volver al catálogo</Link>
        <h2 className="text-lg font-bold mb-4">Editar producto</h2>

        {error && (
          <div role="alert" className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Si el producto no existe, no mostramos el formulario */}
        {!notFound && (
          <div className="flex flex-col gap-3">
            <input className="input input-bordered" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
            <input className="input input-bordered" name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} />
            <input className="input input-bordered" name="image" placeholder="URL de imagen" value={form.image} onChange={handleChange} />
            <button className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
          </div>
        )}
      </div>
    </div>
  );
}
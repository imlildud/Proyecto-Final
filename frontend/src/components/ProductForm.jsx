import { useState } from "react";
import { useProductStore } from "../store/useProductStore";

export default function ProductForm({ onSuccess }) {
  const createProduct = useProductStore((state) => state.createProduct);

  // Estado local para los campos del formulario
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // Estados para retroalimentación al usuario
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    // Enviamos los datos al store (price convertido a número)
    const result = await createProduct({
      name,
      price: Number(price),
      image,
    });

    setSubmitting(false);

    if (result.success) {
      // Limpiamos el formulario y notificamos al componente padre
      setName("");
      setPrice("");
      setImage("");
      if (onSuccess) onSuccess();
    } else {
      setFormError(result.message);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div role="alert" className="alert alert-error text-sm py-2">
          <span>{formError}</span>
        </div>
      )}

      {/* Campo: Nombre del producto */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Nombre del producto</span>
        </label>
        <input
          type="text"
          placeholder="Ej. Teclado Mecánico"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {fieldErrors.name && (
          <span className="text-error text-xs mt-1">{fieldErrors.name[0]}</span>
        )}
      </div>

      {/* Campo: Precio */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Precio</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej. 850.00"
          className="input input-bordered w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {fieldErrors.price && (
          <span className="text-error text-xs mt-1">{fieldErrors.price[0]}</span>
        )}
      </div>

      {/* Campo: URL de la imagen */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">URL de la imagen</span>
        </label>
        <input
          type="url"
          placeholder="https://..."
          className="input input-bordered w-full"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        {fieldErrors.image && (
          <span className="text-error text-xs mt-1">{fieldErrors.image[0]}</span>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </form>
  );
}
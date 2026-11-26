import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

export default function ProductCard({ product }) {
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);

    const result = await deleteProduct(product.id);

    if (!result.success) {
      setDeleteError(result.message);
      setDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <figure>
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p className="text-lg font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>

        {deleteError && (
          <p className="text-sm text-error" role="alert">
            {deleteError}
          </p>
        )}

        <div className="card-actions justify-end gap-2">
          <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline">
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-sm btn-error btn-outline"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
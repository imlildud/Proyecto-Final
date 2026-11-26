import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
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
        {/* Enlace a la pantalla de edición del producto (Jornada 3 - HU03) */}
        <div className="card-actions justify-end">
          <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline">
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
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
      </div>
    </div>
  );
}

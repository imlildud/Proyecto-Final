import { create } from "zustand";
import axios from "axios";

// En desarrollo Vite redirige /api al backend; en despliegue se usa VITE_API_URL
const API = import.meta.env.VITE_API_URL || "";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API}/api/products`);
      set({ products: response.data.data, loading: false });
    } catch (err) {
      set({ error: "No se pudo cargar el catálogo", loading: false });
    }
  },

  // Acción para registrar un nuevo producto 
  createProduct: async (newProduct) => {
    try {
      const response = await axios.post(`${API}/api/products`, newProduct);
      const created = response.data.data;

      set((state) => ({
        products: [created, ...state.products],
      }));

      return { success: true };
    } catch (err) {
      // Capturamos el mensaje de error enviado por Zod o el servidor
      const message =
        err.response?.data?.message || "No se pudo registrar el producto";
      const fieldErrors = err.response?.data?.errors || null;
      return { success: false, message, fieldErrors };
    }
  },

  // Acción para cargar un producto por su ID y precargar el formulario de edición (Jornada 3 - HU03)
  fetchProductById: async (id) => {
    try {
      const response = await axios.get(`${API}/api/products/${id}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      // 404 si el ID no existe; devolvemos el mensaje para mostrarlo en la vista
      const message =
        err.response?.data?.message || "No se pudo cargar el producto";
      return { success: false, message };
    }
  },

  // Acción para guardar el formulario completo de un producto (Jornada 3 - HU03)
  updateProduct: async (id, updatedProduct) => {
    try {
      const response = await axios.put(`${API}/api/products/${id}`, updatedProduct);
      const updated = response.data.data;

      // Solo reemplazamos el producto en memoria si el servidor confirmó el cambio;
      // si falla, el catálogo conserva el último dato confirmado
      set((state) => ({
        products: state.products.map((p) => (p.id === updated.id ? updated : p)),
      }));

      return { success: true };
    } catch (err) {
      // Capturamos el mensaje de error enviado por Zod o el servidor
      const message =
        err.response?.data?.message || "No se pudo actualizar el producto";
      const fieldErrors = err.response?.data?.errors || null;
      return { success: false, message, fieldErrors };
    }
  },

  // Acción para eliminar un producto por su ID 
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`);

      // Solo quitamos el producto del catálogo en memoria si el servidor confirmó la baja
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo eliminar el producto";
      return { success: false, message };
    }
  },
}));
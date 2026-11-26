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

  // Acción para registrar un nuevo producto (Jornada 2 - HU02)
  createProduct: async (newProduct) => {
    try {
      const response = await axios.post(`${API}/api/products`, newProduct);
      const created = response.data.data;

      // Agregamos el producto recién creado al inicio de la lista en memoria
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
}));
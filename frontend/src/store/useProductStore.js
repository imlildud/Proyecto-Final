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
}));

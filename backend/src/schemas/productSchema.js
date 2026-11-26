import { z } from "zod";

// Esquema DTO de entrada para validar los datos al crear un producto (HU02)
export const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(1, "El nombre no puede estar vacío"),
  price: z.coerce // Convierte cadenas numéricas (ej. "150.50") a número
    .number({ invalid_type_error: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0"),
  image: z
    .string({ required_error: "La URL de la imagen es obligatoria" })
    .trim()
    .url("Debe ser una URL válida (ej. https://...)"),
});
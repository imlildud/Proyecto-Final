import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

export default app;

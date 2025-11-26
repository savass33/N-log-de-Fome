import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes"; // Importa o index.ts da pasta routes

const app = express();

app.use(cors());
app.use(express.json());

// Usa todas as rotas com prefixo /api
app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Backend rodando na porta ${PORT}`);
});

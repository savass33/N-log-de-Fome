import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/client';

// Inicializa o Express e o Prisma
const app = express();
const prisma = new PrismaClient();

// Configura middlewares
app.use(cors()); // Permite que o frontend (Vite) aceda a esta API
app.use(express.json()); // Permite-nos ler o 'body' de pedidos POST em JSON

// --- A SUA API COMEÇA AQUI ---

// Rota de Teste (para ver se funciona)
app.get('/api/teste', (req, res) => {
  res.json({ message: '🎉 Backend N-log-de-Fome está a funcionar!' });
});

// Rota para LER todos os Clientes (exemplo com Prisma)
app.get('/api/clientes', async (req, res) => {
  try {
    // Tente escrever 'prisma.' e veja o autocomplete!
    const clientes = await prisma.cliente.findMany(); 
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os clientes' });
  }
});

// --- FIM DA API ---

// Inicia o servidor
const PORT = 3001; // Usamos 3001 para não chocar com o Vite (que usa 5173)
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a correr em http://localhost:${PORT}`);
});
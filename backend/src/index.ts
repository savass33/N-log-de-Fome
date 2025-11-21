import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Se o VS Code marcar erro aqui, mude para '@prisma/client'
import { PrismaClient } from './generated/prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- ROTA DE TESTE ---
app.get('/api/teste', (req, res) => {
  res.json({ message: '🎉 Backend N-log-de-Fome está a funcionar!' });
});

// --- ROTA DE CLIENTES ---
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    // O ERRO VERMELHO VAI APARECER AQUI NO TERMINAL
    console.error("❌ ERRO CRÍTICO NO PRISMA (CLIENTES):", error);
    res.status(500).json({ 
      error: 'Não foi possível buscar os clientes', 
      details: String(error) 
    });
  }
});

// --- ROTA DE RESTAURANTES ---
app.get('/api/restaurantes', async (req, res) => {
  try {
    const restaurantes = await prisma.restaurante.findMany();
    res.json(restaurantes);
  } catch (error) {
    console.error("❌ ERRO CRÍTICO NO PRISMA (RESTAURANTES):", error);
    res.status(500).json({ 
      error: 'Não foi possível buscar os restaurantes', 
      details: String(error) 
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a correr em http://localhost:${PORT}`);
});
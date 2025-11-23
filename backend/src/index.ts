import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Importa o cliente do Prisma. Se der erro, tente '@prisma/client'
import { PrismaClient } from './generated/prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- ROTA DE TESTE ---
app.get('/api/teste', (req, res) => {
  res.json({ message: '🎉 Backend N-log-de-Fome está a funcionar!' });
});

// --- CLIENTES ---
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error("❌ Erro Clientes:", error);
    res.status(500).json({ error: 'Erro ao buscar clientes', details: String(error) });
  }
});

// --- RESTAURANTES ---
app.get('/api/restaurantes', async (req, res) => {
  try {
    const restaurantes = await prisma.restaurante.findMany();
    res.json(restaurantes);
  } catch (error) {
    console.error("❌ Erro Restaurantes:", error);
    res.status(500).json({ error: 'Erro ao buscar restaurantes', details: String(error) });
  }
});

// --- PEDIDOS ---
app.get('/api/pedidos', async (req, res) => {
  try {
    // CORREÇÃO: Relações em minúsculas (convenção do Prisma)
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,      // Era CLIENTE
        restaurante: true,  // Era RESTAURANTE
        itempedido: true    // O Prisma geralmente gera "iTEMPEDIDO" para tabelas UPPERCASE
      },
      orderBy: {
        id_pedido: 'desc'
      }
    });
    res.json(pedidos);
  } catch (error) {
    console.error("❌ Erro Pedidos:", error);
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: String(error) });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a correr em http://localhost:${PORT}`);
});
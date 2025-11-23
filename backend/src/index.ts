import "dotenv/config";
import express from "express";
import cors from "cors";
// Importa o cliente do Prisma. Se der erro, tente '@prisma/client'
import { PrismaClient } from "./generated/prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- ROTA DE HEALTH CHECK ---
app.get("/api/teste", (req, res) => {
  res.json({
    message: "🎉 Backend N-log-de-Fome está a funcionar e atualizado!",
  });
});

// ==================================================================
// 🔐 AUTENTICAÇÃO E ADMINISTRAÇÃO
// ==================================================================

// 1. LOGIN UNIFICADO (Busca por Email)
app.post("/api/auth/login", async (req, res) => {
  const { email, role } = req.body;

  try {
    let user = null;

    if (role === "client") {
      user = await prisma.cliente.findFirst({ where: { email: email } });
    } else if (role === "restaurant") {
      user = await prisma.restaurante.findFirst({ where: { email: email } });
    } else if (role === "admin") {
      user = await prisma.admin.findFirst({ where: { email: email } });
    }

    if (!user) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado com este email." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no login" });
  }
});

// 2. CRIAR ADMIN (Necessário para cadastrar o primeiro admin via Postman/Front)
app.post("/api/admins", async (req, res) => {
  const { nome, telefone, email } = req.body;
  try {
    const novoAdmin = await prisma.admin.create({
      data: { nome, telefone, email },
    });
    res.status(201).json(novoAdmin);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar admin", details: String(error) });
  }
});

app.put("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;
  try {
    const adminAtualizado = await prisma.admin.update({
      where: { id_admin: Number(id) },
      data: { nome, telefone, email },
    });
    res.json(adminAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar admin" });
  }
});

// 3. LEGADO: Login pegando o primeiro (Mantido para testes rápidos, se necessário)
app.post("/api/auth/login/debug", async (req, res) => {
  const { role } = req.body;
  try {
    let user;
    if (role === "client") user = await prisma.cliente.findFirst();
    else if (role === "restaurant") user = await prisma.restaurante.findFirst();
    else user = await prisma.admin.findFirst();

    res.json(user || { error: "Nenhum usuário encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Erro debug login" });
  }
});

// ==================================================================
// 👤 CLIENTES
// ==================================================================

app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: Number(id) },
    });
    if (!cliente)
      return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});

app.post("/api/clientes", async (req, res) => {
  const { nome, telefone, endereco, email } = req.body;
  try {
    const novoCliente = await prisma.cliente.create({
      data: { nome, telefone, endereco, email },
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco, email } = req.body;
  try {
    const clienteAtualizado = await prisma.cliente.update({
      where: { id_cliente: Number(id) },
      data: { nome, telefone, endereco, email },
    });
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica se existe antes de deletar
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id_cliente: Number(id) },
    });

    if (!clienteExiste) {
      return res
        .status(404)
        .json({ error: "Cliente não encontrado para exclusão." });
    }

    await prisma.cliente.delete({ where: { id_cliente: Number(id) } });
    res.json({
      message: "Cliente e seus pedidos foram deletados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    // Retorna mensagem amigável se for erro de constraint (caso não tenha feito o passo 1)
    if (String(error).includes("Foreign key constraint")) {
      return res.status(400).json({
        error:
          "Não é possível deletar este cliente pois ele possui pedidos ativos.",
      });
    }
    res.status(500).json({ error: "Erro interno ao deletar cliente." });
  }
});

// ==================================================================
// 🍽️ RESTAURANTES
// ==================================================================

app.get("/api/restaurantes", async (req, res) => {
  try {
    const restaurantes = await prisma.restaurante.findMany();
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar restaurantes" });
  }
});

app.get("/api/restaurantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await prisma.restaurante.findUnique({
      where: { id_restaurante: Number(id) },
    });
    if (!restaurante)
      return res.status(404).json({ error: "Restaurante não encontrado" });
    res.json(restaurante);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// 3. Criar Restaurante
app.post("/api/restaurantes", async (req, res) => {
  // Adicione 'endereco' na desestruturação
  const { nome, telefone, tipo_cozinha, email, endereco } = req.body;
  try {
    const novoRestaurante = await prisma.restaurante.create({
      data: {
        nome,
        telefone,
        tipo_cozinha,
        email,
        endereco, // Salva no banco
      },
    });
    res.status(201).json(novoRestaurante);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar", details: String(error) });
  }
});

// 4. Atualizar Restaurante
app.put("/api/restaurantes/:id", async (req, res) => {
  const { id } = req.params;
  // Adicione 'endereco'
  const { nome, telefone, tipo_cozinha, email, endereco } = req.body;
  try {
    const atualizado = await prisma.restaurante.update({
      where: { id_restaurante: Number(id) },
      data: {
        nome,
        telefone,
        tipo_cozinha,
        email,
        endereco, // Atualiza no banco
      },
    });
    res.json(atualizado);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar", details: String(error) });
  }
});

app.delete("/api/restaurantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.restaurante.delete({ where: { id_restaurante: Number(id) } });
    res.json({ message: "Restaurante deletado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar" });
  }
});

// ==================================================================
// 📦 PEDIDOS
// ==================================================================

// 1. Listar TODOS os pedidos (Visão Admin)
app.get("/api/pedidos", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        restaurante: true,
        itempedido: true,
      },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// 2. [NOVO] Listar pedidos de um RESTAURANTE específico
app.get("/api/pedidos/restaurante/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_restaurante_fk: Number(id) },
      include: {
        cliente: true,
        itempedido: true,
      },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos do restaurante" });
  }
});

// 3. [NOVO] Listar pedidos de um CLIENTE específico (Histórico)
app.get("/api/pedidos/cliente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_cliente_fk: Number(id) },
      include: {
        restaurante: true,
        itempedido: true,
      },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos do cliente" });
  }
});

// 4. Buscar Pedido por ID (Detalhes)
app.get("/api/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: Number(id) },
      include: {
        cliente: true,
        restaurante: true,
        itempedido: true,
      },
    });
    if (!pedido)
      return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// 5. CRIAR NOVO PEDIDO
app.post("/api/pedidos", async (req, res) => {
  const { id_cliente_fk, id_restaurante_fk, itens } = req.body;

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        id_cliente_fk: Number(id_cliente_fk),
        id_restaurante_fk: Number(id_restaurante_fk),
        data_hora: new Date(),
        status_pedido: "Pendente", // Valor inicial correto conforme novo SQL

        itempedido: {
          create: itens.map((item: any) => ({
            descri__o: item.descricao,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        },
      },
      include: { itempedido: true },
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

// 6. ATUALIZAR STATUS DO PEDIDO
app.put("/api/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  const { status_pedido } = req.body; // Vem do front: "preparing", "on_the_way", etc.

  // Mapeamento correto com o novo SQL (Enum Completo)
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    preparing: "Preparando",
    on_the_way: "Caminho",
    delivered: "Entregue",
    canceled: "Cancelado",
  };

  // Se o front mandar em português direto, usa ele, senão traduz
  const statusParaBanco = statusMap[status_pedido] || status_pedido;

  try {
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id_pedido: Number(id) },
      data: {
        status_pedido: statusParaBanco as any,
      },
    });
    res.json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro atualização status:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// ==================================================================
// 🛵 ENTREGADORES (NOVO - Para futuro uso)
// ==================================================================

app.get("/api/entregadores", async (req, res) => {
  try {
    const entregadores = await prisma.entregador.findMany();
    res.json(entregadores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar entregadores" });
  }
});

app.post("/api/entregadores", async (req, res) => {
  const { nome, status_entrega } = req.body;
  try {
    const novo = await prisma.entregador.create({
      data: {
        nome,
        status_entrega: status_entrega || "Caminho",
      },
    });
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar entregador" });
  }
});

// ==================================================================
// 🚀 INICIALIZAÇÃO
// ==================================================================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a correr em http://localhost:${PORT}`);
});

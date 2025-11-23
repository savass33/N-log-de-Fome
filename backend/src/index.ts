import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "./generated/prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- HELPER: Trata erros do Prisma para mensagens amigáveis ---
const handlePrismaError = (error: any, res: any) => {
  console.error("Erro Prisma:", error);

  // Erro de registro duplicado (ex: email já existe)
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = (error.meta as any)?.target || "campo único";
    return res
      .status(400)
      .json({ error: `Já existe um registro com este ${target}.` });
  }

  // Erro de registro não encontrado
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({ error: "Registro não encontrado." });
  }

  // Erro de chave estrangeira (caso o Cascade falhe)
  if (String(error).includes("Foreign key constraint")) {
    return res
      .status(400)
      .json({
        error:
          "Não é possível realizar esta ação pois existem dados vinculados.",
      });
  }

  return res
    .status(500)
    .json({ error: "Erro interno do servidor.", details: String(error) });
};

// --- ROTA DE HEALTH CHECK ---
app.get("/api/teste", (req, res) => {
  res.json({ message: "🎉 Backend N-log-de-Fome está rodando liso!" });
});

// ==================================================================
// 🔐 AUTENTICAÇÃO
// ==================================================================

app.post("/api/auth/login", async (req, res) => {
  const { email, role } = req.body;

  if (!email) return res.status(400).json({ error: "Email é obrigatório." });

  try {
    let user = null;

    if (role === "client") {
      user = await prisma.cliente.findFirst({ where: { email } });
    } else if (role === "restaurant") {
      user = await prisma.restaurante.findFirst({ where: { email } });
    } else if (role === "admin") {
      user = await prisma.admin.findFirst({ where: { email } });
    }

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            "Usuário não encontrado. Verifique o e-mail ou o perfil selecionado.",
        });
    }

    res.json(user);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/admins", async (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome || !email)
    return res.status(400).json({ error: "Nome e Email são obrigatórios." });

  try {
    const novoAdmin = await prisma.admin.create({
      data: { nome, telefone, email },
    });
    res.status(201).json(novoAdmin);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.put("/api/admins/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  const { nome, telefone, email } = req.body;
  try {
    const adminAtualizado = await prisma.admin.update({
      where: { id_admin: id },
      data: { nome, telefone, email },
    });
    res.json(adminAtualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 👤 CLIENTES
// ==================================================================

app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(clientes);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: id },
    });
    if (!cliente)
      return res.status(404).json({ error: "Cliente não encontrado." });
    res.json(cliente);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/clientes", async (req, res) => {
  const { nome, telefone, endereco, email } = req.body;

  // Validação Backend
  if (!nome || !email)
    return res.status(400).json({ error: "Nome e Email são obrigatórios." });

  try {
    const novoCliente = await prisma.cliente.create({
      data: { nome, telefone, endereco, email },
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  const { nome, telefone, endereco, email } = req.body;
  try {
    const clienteAtualizado = await prisma.cliente.update({
      where: { id_cliente: id },
      data: { nome, telefone, endereco, email },
    });
    res.json(clienteAtualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    // Graças ao onDelete: Cascade no Schema, isso deletará pedidos automaticamente
    await prisma.cliente.delete({ where: { id_cliente: id } });
    res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 🍽️ RESTAURANTES
// ==================================================================

app.get("/api/restaurantes", async (req, res) => {
  try {
    const restaurantes = await prisma.restaurante.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(restaurantes);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/restaurantes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const restaurante = await prisma.restaurante.findUnique({
      where: { id_restaurante: id },
    });
    if (!restaurante)
      return res.status(404).json({ error: "Restaurante não encontrado." });
    res.json(restaurante);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/restaurantes", async (req, res) => {
  const { nome, telefone, tipo_cozinha, email, endereco } = req.body;
  if (!nome || !email)
    return res.status(400).json({ error: "Nome e Email são obrigatórios." });

  try {
    const novoRestaurante = await prisma.restaurante.create({
      data: { nome, telefone, tipo_cozinha, email, endereco },
    });
    res.status(201).json(novoRestaurante);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.put("/api/restaurantes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  const { nome, telefone, tipo_cozinha, email, endereco } = req.body;
  try {
    const atualizado = await prisma.restaurante.update({
      where: { id_restaurante: id },
      data: { nome, telefone, tipo_cozinha, email, endereco },
    });
    res.json(atualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.delete("/api/restaurantes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    await prisma.restaurante.delete({ where: { id_restaurante: id } });
    res.json({ message: "Restaurante deletado com sucesso." });
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 🍔 ITENS DO CARDÁPIO (NOVO)
// ==================================================================

// Listar itens de um restaurante específico
app.get("/api/cardapio/restaurante/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const itens = await prisma.item_cardapio.findMany({
      where: { id_restaurante_fk: id },
      orderBy: { categoria: 'asc' }
    });
    res.json(itens);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// Criar item no cardápio
app.post("/api/cardapio", async (req, res) => {
  const { id_restaurante_fk, nome, descricao, preco, categoria, imagem_url } = req.body;
  
  if (!id_restaurante_fk || !nome || !preco) {
    return res.status(400).json({ error: "Dados obrigatórios faltando." });
  }

  try {
    const novoItem = await prisma.item_cardapio.create({
      data: {
        id_restaurante_fk: Number(id_restaurante_fk),
        nome,
        descricao,
        preco: Number(preco),
        categoria,
        imagem_url
      }
    });
    res.status(201).json(novoItem);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// Atualizar item
app.put("/api/cardapio/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao, preco, categoria, imagem_url } = req.body;

  try {
    const atualizado = await prisma.item_cardapio.update({
      where: { id_item_cardapio: id },
      data: { nome, descricao, preco: Number(preco), categoria, imagem_url }
    });
    res.json(atualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// Deletar item
app.delete("/api/cardapio/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.item_cardapio.delete({ where: { id_item_cardapio: id } });
    res.json({ message: "Item removido do cardápio." });
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 📦 PEDIDOS
// ==================================================================

app.get("/api/pedidos", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { cliente: true, restaurante: true, itempedido: true },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/pedidos/restaurante/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_restaurante_fk: id },
      include: { cliente: true, itempedido: true },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/pedidos/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_cliente_fk: id },
      include: { restaurante: true, itempedido: true },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/pedidos/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: id },
      include: { cliente: true, restaurante: true, itempedido: true },
    });
    if (!pedido)
      return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(pedido);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/pedidos", async (req, res) => {
  const { id_cliente_fk, id_restaurante_fk, itens } = req.body;

  if (!id_cliente_fk || !id_restaurante_fk || !itens || itens.length === 0) {
    return res.status(400).json({ error: "Dados do pedido incompletos." });
  }

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        id_cliente_fk: Number(id_cliente_fk),
        id_restaurante_fk: Number(id_restaurante_fk),
        data_hora: new Date(),
        status_pedido: "Pendente",
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
    handlePrismaError(error, res);
  }
});

app.put("/api/pedidos/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

  const { status_pedido } = req.body;
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    preparing: "Preparando",
    on_the_way: "Caminho",
    delivered: "Entregue",
    canceled: "Cancelado",
  };
  const statusParaBanco = statusMap[status_pedido] || status_pedido;

  try {
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id_pedido: id },
      data: { status_pedido: statusParaBanco as any },
    });
    res.json(pedidoAtualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 🛵 ENTREGADORES
// ==================================================================

app.get("/api/entregadores", async (req, res) => {
  try {
    const entregadores = await prisma.entregador.findMany();
    res.json(entregadores);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/entregadores", async (req, res) => {
  const { nome, status_entrega } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  try {
    const novo = await prisma.entregador.create({
      data: { nome, status_entrega: status_entrega || "Caminho" },
    });
    res.status(201).json(novo);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 🚀 INICIALIZAÇÃO
// ==================================================================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});

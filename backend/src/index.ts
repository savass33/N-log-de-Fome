import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper para erros genéricos (não trata mais duplicidade automática, pois faremos manual)
const handlePrismaError = (error: any, res: any) => {
  console.error("Erro Prisma:", error);
  // Se ainda ocorrer algum erro de banco não previsto
  res
    .status(500)
    .json({ error: "Erro interno do servidor.", details: String(error) });
};

// --- ROTA DE HEALTH CHECK ---
app.get("/api/teste", (req, res) => {
  res.json({
    message: "🎉 Backend N-log-de-Fome rodando com validações manuais!",
  });
});

// ==================================================================
// 🔐 AUTENTICAÇÃO & ADMIN
// ==================================================================

app.post("/api/auth/login", async (req, res) => {
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email é obrigatório." });

  try {
    let user = null;
    if (role === "client")
      user = await prisma.cliente.findFirst({ where: { email } });
    else if (role === "restaurant")
      user = await prisma.restaurante.findFirst({ where: { email } });
    else if (role === "admin")
      user = await prisma.admin.findFirst({ where: { email } });

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });
    res.json(user);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/admins", async (req, res) => {
  const { nome, telefone, email } = req.body;

  try {
    // VALIDAÇÃO: Email já existe?
    const existe = await prisma.admin.findFirst({ where: { email } });
    if (existe) {
      return res
        .status(409)
        .json({ error: "Este e-mail de administrador já está em uso." });
    }

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
  const { nome, telefone, email } = req.body;

  try {
    // VALIDAÇÃO NO UPDATE: Email já existe em OUTRO admin?
    const existeOutro = await prisma.admin.findFirst({
      where: {
        email: email,
        NOT: { id_admin: id }, // Ignora o próprio usuário (se ele não mudou o email)
      },
    });

    if (existeOutro) {
      return res
        .status(409)
        .json({
          error: "Este e-mail já está sendo usado por outro administrador.",
        });
    }

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
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: Number(req.params.id) },
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

  try {
    // VALIDAÇÃO: Email duplicado
    const existeEmail = await prisma.cliente.findFirst({ where: { email } });
    if (existeEmail) {
      return res
        .status(409)
        .json({ error: "Já existe um cliente cadastrado com este e-mail." });
    }

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
  const { nome, telefone, endereco, email } = req.body;

  try {
    // VALIDAÇÃO: Email duplicado em outro cliente
    const existeOutro = await prisma.cliente.findFirst({
      where: {
        email,
        NOT: { id_cliente: id },
      },
    });

    if (existeOutro) {
      return res
        .status(409)
        .json({ error: "Este e-mail já pertence a outro cliente." });
    }

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
  try {
    // Como não tem cascade no banco, verificamos manualmente os pedidos
    const temPedidos = await prisma.pedido.findFirst({
      where: { id_cliente_fk: id },
    });

    if (temPedidos) {
      return res
        .status(400)
        .json({
          error:
            "Não é possível excluir: Este cliente possui pedidos registrados.",
        });
    }

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
    const restaurantes = await prisma.restaurante.findMany();
    res.json(restaurantes);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/restaurantes/:id", async (req, res) => {
  try {
    const restaurante = await prisma.restaurante.findUnique({
      where: { id_restaurante: Number(req.params.id) },
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

  try {
    // VALIDAÇÃO DUPLA: Nome E Email
    const existeNome = await prisma.restaurante.findFirst({ where: { nome } });
    if (existeNome)
      return res
        .status(409)
        .json({ error: "Já existe um restaurante com este nome." });

    const existeEmail = await prisma.restaurante.findFirst({
      where: { email },
    });
    if (existeEmail)
      return res
        .status(409)
        .json({ error: "Já existe um restaurante com este e-mail." });

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
  const { nome, telefone, tipo_cozinha, email, endereco } = req.body;

  try {
    // VALIDAÇÃO DUPLA NO UPDATE
    const existeNome = await prisma.restaurante.findFirst({
      where: { nome, NOT: { id_restaurante: id } },
    });
    if (existeNome)
      return res
        .status(409)
        .json({ error: "Este nome de restaurante já está em uso." });

    const existeEmail = await prisma.restaurante.findFirst({
      where: { email, NOT: { id_restaurante: id } },
    });
    if (existeEmail)
      return res
        .status(409)
        .json({ error: "Este e-mail já está em uso por outro restaurante." });

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
  try {
    // Verificação manual de dependência
    const temPedidos = await prisma.pedido.findFirst({
      where: { id_restaurante_fk: id },
    });
    if (temPedidos)
      return res
        .status(400)
        .json({ error: "Impossível excluir: Restaurante possui pedidos." });

    await prisma.restaurante.delete({ where: { id_restaurante: id } });
    res.json({ message: "Restaurante deletado." });
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
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_restaurante_fk: Number(req.params.id) },
      include: { cliente: true, itempedido: true },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/pedidos/cliente/:id", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_cliente_fk: Number(req.params.id) },
      include: { restaurante: true, itempedido: true },
      orderBy: { id_pedido: "desc" },
    });
    res.json(pedidos);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.get("/api/pedidos/:id", async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: Number(req.params.id) },
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
      where: { id_pedido: Number(req.params.id) },
      data: { status_pedido: statusParaBanco as any },
    });
    res.json(pedidoAtualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

// ==================================================================
// 🍔 CARDÁPIO
// ==================================================================

app.get("/api/cardapio/restaurante/:id", async (req, res) => {
  try {
    const itens = await prisma.item_cardapio.findMany({
      where: { id_restaurante_fk: Number(req.params.id) },
      orderBy: { categoria: "asc" },
    });
    res.json(itens);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.post("/api/cardapio", async (req, res) => {
  const { id_restaurante_fk, nome, descricao, preco, categoria, imagem_url } =
    req.body;

  try {
    // VALIDAÇÃO: Nome do prato já existe no mesmo restaurante?
    const existePrato = await prisma.item_cardapio.findFirst({
      where: {
        id_restaurante_fk: Number(id_restaurante_fk),
        nome: nome,
      },
    });

    if (existePrato) {
      return res
        .status(409)
        .json({ error: "Você já tem um item com este nome no cardápio." });
    }

    const novoItem = await prisma.item_cardapio.create({
      data: {
        id_restaurante_fk: Number(id_restaurante_fk),
        nome,
        descricao,
        preco: Number(preco),
        categoria,
        imagem_url,
      },
    });
    res.status(201).json(novoItem);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.put("/api/cardapio/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao, preco, categoria, imagem_url } = req.body;

  try {
    const atualizado = await prisma.item_cardapio.update({
      where: { id_item_cardapio: id },
      data: { nome, descricao, preco: Number(preco), categoria, imagem_url },
    });
    res.json(atualizado);
  } catch (error) {
    handlePrismaError(error, res);
  }
});

app.delete("/api/cardapio/:id", async (req, res) => {
  try {
    await prisma.item_cardapio.delete({
      where: { id_item_cardapio: Number(req.params.id) },
    });
    res.json({ message: "Item removido." });
  } catch (error) {
    handlePrismaError(error, res);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});

import { pool } from "../config/db";

export class OrderRepository {
  private async getItemsByOrderId(orderId: number) {
    const [rows]: any = await pool.execute(
      "SELECT * FROM ITEMPEDIDO WHERE id_pedido_fk = ?",
      [orderId]
    );
    return rows;
  }

  private async enrichOrder(order: any) {
    const [clientes]: any = await pool.execute(
      "SELECT * FROM CLIENTE WHERE id_cliente = ?",
      [order.id_cliente_fk]
    );
    const [restaurantes]: any = await pool.execute(
      "SELECT * FROM RESTAURANTE WHERE id_restaurante = ?",
      [order.id_restaurante_fk]
    );

    order.cliente = clientes[0] || null;
    order.restaurante = restaurantes[0] || null;
    order.itempedido = await this.getItemsByOrderId(order.id_pedido);

    return order;
  }

  async findAll() {
    const [orders]: any = await pool.execute(
      "SELECT * FROM PEDIDO ORDER BY id_pedido DESC"
    );

    const enrichedOrders = await Promise.all(
      orders.map((order: any) => this.enrichOrder(order))
    );
    return enrichedOrders;
  }

  async findById(id: number) {
    const [rows]: any = await pool.execute(
      "SELECT * FROM PEDIDO WHERE id_pedido = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return this.enrichOrder(rows[0]);
  }

  async findByRestaurant(restaurantId: number) {
    const [orders]: any = await pool.execute(
      "SELECT * FROM PEDIDO WHERE id_restaurante_fk = ? ORDER BY id_pedido DESC",
      [restaurantId]
    );
    return Promise.all(orders.map((order: any) => this.enrichOrder(order)));
  }

  async findByClient(clientId: number) {
    const [orders]: any = await pool.execute(
      "SELECT * FROM PEDIDO WHERE id_cliente_fk = ? ORDER BY id_pedido DESC",
      [clientId]
    );
    return Promise.all(orders.map((order: any) => this.enrichOrder(order)));
  }

  async create(data: { clientId: number; restaurantId: number; items: any[] }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result]: any = await conn.execute(
        "INSERT INTO PEDIDO (id_cliente_fk, id_restaurante_fk, data_hora, status_pedido) VALUES (?, ?, NOW(), ?)",
        [data.clientId, data.restaurantId, "Pendente"]
      );
      const orderId = result.insertId;
      for (const item of data.items) {
        await conn.execute(
          "INSERT INTO ITEMPEDIDO (id_pedido_fk, descrição, quantidade, preco) VALUES (?, ?, ?, ?)",
          [orderId, item.descricao, item.quantidade, item.preco]
        );
      }

      await conn.commit();
      return this.findById(orderId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateStatus(id: number, status: string) {
    await pool.execute(
      "UPDATE PEDIDO SET status_pedido = ? WHERE id_pedido = ?",
      [status, id]
    );
    return this.findById(id);
  }
}

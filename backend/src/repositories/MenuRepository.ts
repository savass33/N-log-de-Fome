import { pool } from "../config/db";

export class MenuRepository {
  async findByRestaurant(restaurantId: number) {
    const [rows] = await pool.execute(
      "SELECT * FROM ITEM_CARDAPIO WHERE id_restaurante_fk = ? ORDER BY categoria ASC",
      [restaurantId]
    );
    return rows;
  }

  async findByNameInRestaurant(restaurantId: number, name: string) {
    const [rows]: any = await pool.execute(
      "SELECT * FROM ITEM_CARDAPIO WHERE id_restaurante_fk = ? AND nome = ?",
      [restaurantId, name]
    );
    return rows[0];
  }

  async create(data: any) {
    const sql = `INSERT INTO ITEM_CARDAPIO (id_restaurante_fk, nome, descricao, preco, categoria, imagem_url) VALUES (?, ?, ?, ?, ?, ?)`;

    // CORREÇÃO: O operador || null garante que se for undefined, envia null pro SQL
    const params = [
      data.id_restaurante_fk,
      data.nome,
      data.descricao || null,
      data.preco,
      data.categoria,
      data.imagem_url || null,
    ];

    const [result]: any = await pool.execute(sql, params);
    return { id_item_cardapio: result.insertId, ...data };
  }

  async update(id: number, data: any) {
    const sql = `UPDATE ITEM_CARDAPIO SET nome=?, descricao=?, preco=?, categoria=?, imagem_url=? WHERE id_item_cardapio=?`;

    // CORREÇÃO: Mesma proteção aqui no update
    const params = [
      data.nome,
      data.descricao || null,
      data.preco,
      data.categoria,
      data.imagem_url || null,
      id,
    ];

    await pool.execute(sql, params);
    return { id_item_cardapio: id, ...data };
  }

  async delete(id: number) {
    await pool.execute("DELETE FROM ITEM_CARDAPIO WHERE id_item_cardapio = ?", [
      id,
    ]);
  }
}

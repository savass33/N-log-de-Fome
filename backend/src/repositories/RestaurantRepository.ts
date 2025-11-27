import { pool } from "../config/db";

export class RestaurantRepository {
  async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM RESTAURANTE ORDER BY nome ASC"
    );
    return rows;
  }

  async findById(id: number) {
    const [rows]: any = await pool.execute(
      "SELECT * FROM RESTAURANTE WHERE id_restaurante = ?",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmailOrName(email: string, name: string, excludeId?: number) {
    let sql = "SELECT * FROM RESTAURANTE WHERE (email = ? OR nome = ?)";
    const params: any[] = [email, name];

    if (excludeId) {
      sql += " AND id_restaurante != ?";
      params.push(excludeId);
    }

    const [rows]: any = await pool.execute(sql, params);
    return rows[0];
  }

  async create(data: any) {
    const sql = `INSERT INTO RESTAURANTE (nome, telefone, tipo_cozinha, email, endereco) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      data.nome,
      data.telefone,
      data.tipo_cozinha || null,
      data.email,
      data.endereco || null,
    ];
    const [result]: any = await pool.execute(sql, params);
    return { id_restaurante: result.insertId, ...data };
  }

  async update(id: number, data: any) {
    const current = await this.findById(id);
    if (!current) throw new Error("Restaurante não encontrado");

    const sql = `UPDATE RESTAURANTE SET nome=?, telefone=?, tipo_cozinha=?, email=?, endereco=? WHERE id_restaurante=?`;

    const params = [
      data.nome || current.nome,
      data.telefone || current.telefone,
      data.tipo_cozinha || current.tipo_cozinha,
      data.email || current.email,
      data.endereco || current.endereco,
      id,
    ];

    await pool.execute(sql, params);
    return { id_restaurante: id, ...data };
  }

  async delete(id: number) {
    await pool.execute("DELETE FROM RESTAURANTE WHERE id_restaurante = ?", [
      id,
    ]);
  }
}

import { pool } from "../config/db";

export class ClientRepository {
  async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM CLIENTE ORDER BY nome ASC"
    );
    return rows;
  }

  async findById(id: number) {
    const [rows]: any = await pool.execute(
      "SELECT * FROM CLIENTE WHERE id_cliente = ?",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string, excludeId?: number) {
    let sql = "SELECT * FROM CLIENTE WHERE email = ?";
    const params: any[] = [email];

    if (excludeId) {
      sql += " AND id_cliente != ?";
      params.push(excludeId);
    }

    const [rows]: any = await pool.execute(sql, params);
    return rows[0] || null;
  }

  async create(data: {
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
  }) {
    const sql =
      "INSERT INTO CLIENTE (nome, telefone, endereco, email) VALUES (?, ?, ?, ?)";
    const [result]: any = await pool.execute(sql, [
      data.nome,
      data.telefone,
      data.endereco,
      data.email,
    ]);
    return { id_cliente: result.insertId, ...data };
  }

  async update(
    id: number,
    data: { nome: string; telefone: string; endereco: string; email: string }
  ) {
    const sql =
      "UPDATE CLIENTE SET nome=?, telefone=?, endereco=?, email=? WHERE id_cliente=?";
    await pool.execute(sql, [
      data.nome,
      data.telefone,
      data.endereco,
      data.email,
      id,
    ]);
    return this.findById(id);
  }

  async delete(id: number) {
    // SQL DELETE (Assume que o banco tem ON DELETE CASCADE ou que validaremos antes)
    await pool.execute("DELETE FROM CLIENTE WHERE id_cliente = ?", [id]);
  }
}

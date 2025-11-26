import { pool } from "../config/db";

export class AuthRepository {
  async findUserByEmail(
    email: string,
    role: "client" | "restaurant" | "admin"
  ) {
    let query = "";

    // Define a tabela baseado na role
    if (role === "client") query = "SELECT * FROM CLIENTE WHERE email = ?";
    else if (role === "restaurant")
      query = "SELECT * FROM RESTAURANTE WHERE email = ?";
    else if (role === "admin") query = "SELECT * FROM ADMIN WHERE email = ?";

    const [rows]: any = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  async createAdmin(nome: string, email: string, telefone: string) {
    const sql = "INSERT INTO ADMIN (nome, email, telefone) VALUES (?, ?, ?)";
    const [result]: any = await pool.execute(sql, [nome, email, telefone]);
    return { id_admin: result.insertId, nome, email, telefone };
  }
}

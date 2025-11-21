import axios from 'axios';

// DAO BASE: Configuração da conexão HTTP
export const api = axios.create({
  // Aponta para a porta 3001 onde o seu servidor Express/Prisma está a rodar
  baseURL: 'http://localhost:3001/api', 
});
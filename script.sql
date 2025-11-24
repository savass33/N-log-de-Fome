DROP DATABASE IF EXISTS n_log_de_fome;
CREATE DATABASE n_log_de_fome;
USE n_log_de_fome;

CREATE TABLE CLIENTE(
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    endereco VARCHAR(100),
    email VARCHAR(100) 
);

CREATE TABLE ADMIN (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(15)
);

CREATE TABLE RESTAURANTE(
    id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    tipo_cozinha VARCHAR(50),
    endereco VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE PEDIDO(
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_fk INT NOT NULL,
    id_restaurante_fk INT NOT NULL,
    data_hora DATETIME NOT NULL,
    status_pedido ENUM ('Pendente', 'Preparando', 'Caminho', 'Entregue', 'Cancelado') DEFAULT 'Pendente',
    CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente_fk) REFERENCES CLIENTE(id_cliente),
    CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante_fk) REFERENCES RESTAURANTE(id_restaurante) ON DELETE CASCADE
);

CREATE TABLE ITEMPEDIDO(
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido_fk INT NOT NULL,
    descrição VARCHAR(200),
    quantidade INT NOT NULL,
    preco FLOAT NOT NULL,
    CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido_fk) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE
);

CREATE TABLE ITEM_CARDAPIO (
    id_item_cardapio INT AUTO_INCREMENT PRIMARY KEY,
    id_restaurante_fk INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco FLOAT NOT NULL,
    categoria VARCHAR(50), 
    imagem_url VARCHAR(255),
    CONSTRAINT fk_cardapio_restaurante FOREIGN KEY (id_restaurante_fk) REFERENCES RESTAURANTE(id_restaurante) ON DELETE CASCADE
);

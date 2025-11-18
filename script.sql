DROP DATABASE n_log_de_fome;
CREATE DATABASE n_log_de_fome;
USE n_log_de_fome;


	-- Cliente OK
CREATE TABLE CLIENTE(
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    endereco VARCHAR(100)
);

	-- Restaurante OK
CREATE TABLE RESTAURANTE(
	id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    tipo_cozinha VARCHAR(50)
);

	-- Pedido OK
CREATE TABLE PEDIDO(
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_fk INT NOT NULL,
    id_restaurante_fk INT NOT NULL,
    data_hora DATE NOT NULL,
    status_pedido ENUM ('Entregue','Preparando') DEFAULT 'Preparando',
    CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente_fk) REFERENCES CLIENTE(id_cliente),
    CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante_fk) REFERENCES RESTAURANTE(id_restaurante)
    );
    
    -- ItemPedido OK
CREATE TABLE ITEMPEDIDO(
	id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido_fk INT NOT NULL,
    descrição VARCHAR(200),
    quantidade INT NOT NULL,
    preco FLOAT NOT NULL,
    CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido_fk) REFERENCES PEDIDO(id_pedido)
    );
    
    -- Entregador OK
CREATE TABLE ENTREGADOR(
	id_entregador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    status_entrega ENUM('Entregue','Caminho') DEFAULT 'Caminho'
    );

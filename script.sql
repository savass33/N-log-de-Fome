DROP DATABASE n_log_de_fome;
CREATE DATABASE n_log_de_fome;
USE n_log_de_fome;


	-- Cliente OK
CREATE TABLE CLIENTE(
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    endereco VARCHAR(100),
    email VARCHAR(100)
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
    data_hora DATETIME NOT NULL,
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

	-- INSERIR DADOS
-- 1. Inserir Clientes
INSERT INTO CLIENTE (nome, telefone, endereco, email) VALUES 
('Ana Silva', '11999990001', 'Rua das Flores, 123', 'anasilva@example.com'),
('Bruno Costa', '21988880002', 'Av. Paulista, 4500', 'brunocosta@example.com'),
('Carlos Pereira', '31977770003', 'Praça da Liberdade, 10', 'carlospereira@example.com');

-- 2. Inserir Restaurantes
INSERT INTO RESTAURANTE (nome, telefone, tipo_cozinha) VALUES 
('Pizza da Boa', '1133334444', 'Italiana'),
('Sushi Express', '1133335555', 'Japonesa'),
('Burger Kingo', '1133336666', 'Hamburgueria');

-- Pedido Exemplo
INSERT INTO PEDIDO (id_cliente_fk, id_restaurante_fk, data_hora, status_pedido) VALUES (1, 1, NOW(), 'Preparando');
-- Itens do Pedido (Use o ID do pedido criado acima, ex: 1)
INSERT INTO ITEMPEDIDO (id_pedido_fk, descrição, quantidade, preco) VALUES (1, 'Pizza Grande', 1, 45.00);
INSERT INTO ITEMPEDIDO (id_pedido_fk, descrição, quantidade, preco) VALUES (1, 'Coca-Cola', 2, 5.00);
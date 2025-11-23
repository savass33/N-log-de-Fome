import React, { useState, useEffect } from "react";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { type IRestaurant } from "../../interfaces/IRestaurant";

interface RestaurantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    phone: string;
    cuisineType: string;
    email: string;
    address: string;
  }) => void;
  restaurantToEdit: IRestaurant | null; // Se null = Novo, Se objeto = Editar
}

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  restaurantToEdit,
}) => {
  // Estados do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [address, setAddress] = useState("");

  // Popula o formulário quando abre ou muda o restaurante selecionado
  useEffect(() => {
    if (isOpen) {
      if (restaurantToEdit) {
        // Modo Edição: Preenche os campos
        setName(restaurantToEdit.name);
        setPhone(restaurantToEdit.cnpj); // O Adapter mapeia 'telefone' do banco para 'cnpj' na interface
        // Se a interface IRestaurant não tiver email explícito ainda, usamos um fallback ou ajustamos a interface
        // Assumindo que você vai ajustar IRestaurant ou que ele vem no objeto, mas por segurança:
        setEmail((restaurantToEdit as any).email || "");
        setCuisineType(restaurantToEdit.cuisineType || ""); // Ou restaurantToEdit.address se estiver usando o hack antigo
        setAddress(restaurantToEdit.address);
      } else {
        // Modo Criação: Limpa tudo
        setName("");
        setPhone("");
        setEmail("");
        setCuisineType("");
        setAddress("");
      }
    }
  }, [isOpen, restaurantToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: restaurantToEdit?.id, // Passa o ID se for edição
      name,
      phone,
      email,
      cuisineType,
      address,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={restaurantToEdit ? "Editar Restaurante" : "Novo Restaurante"}
      footer={
        <>
          <Button onClick={onClose} style={{ backgroundColor: "#999" }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} type="submit">
            {restaurantToEdit ? "Salvar Alterações" : "Criar Restaurante"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="name">Nome do Restaurante</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: Pizzaria do Luigi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail de Acesso</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="login@restaurante.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone / Contato</label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="(XX) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuisineType">Tipo de Cozinha</label>
          <Input
            id="cuisineType"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            required
            placeholder="Ex: Italiana, Japonesa, Lanches"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Endereço Completo</label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Rua, Número - Bairro"
          />
        </div>
      </form>
    </Modal>
  );
};

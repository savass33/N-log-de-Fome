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
  restaurantToEdit: IRestaurant | null;
}

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  restaurantToEdit,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (restaurantToEdit) {
        setName(restaurantToEdit.name);
        setPhone(formatPhone(restaurantToEdit.cnpj)); // cnpj guarda o telefone
        setEmail((restaurantToEdit as any).email || "");
        setCuisineType(restaurantToEdit.cuisineType || "");
        setAddress(restaurantToEdit.address);
      } else {
        setName("");
        setPhone("");
        setEmail("");
        setCuisineType("");
        setAddress("");
      }
    }
  }, [isOpen, restaurantToEdit]);

  // --- Máscara de Telefone ---
  const formatPhone = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, "");
    if (value.length > 11) return value.slice(0, 11);
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  // --- Validação de Email ---
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sanitização e Validação
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanCuisine = cuisineType.trim();

    if (cleanName.length < 3) return alert("Nome do restaurante muito curto.");

    if (!isValidEmail(cleanEmail)) return alert("E-mail inválido.");

    // Remove máscara para contar dígitos
    if (cleanPhone.replace(/\D/g, "").length < 10)
      return alert("Telefone inválido (mínimo 10 dígitos).");

    if (cleanAddress.length < 5) return alert("Endereço muito curto.");

    if (cleanCuisine.length < 3) return alert("Tipo de cozinha obrigatório.");

    // 2. Salvar
    onSave({
      id: restaurantToEdit?.id,
      name: cleanName,
      phone: cleanPhone, // Pode salvar formatado ou limpo, depende da preferência
      email: cleanEmail,
      cuisineType: cleanCuisine,
      address: cleanAddress,
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
            onChange={handlePhoneChange} // Usa a máscara
            required
            placeholder="(XX) 99999-9999"
            maxLength={15}
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

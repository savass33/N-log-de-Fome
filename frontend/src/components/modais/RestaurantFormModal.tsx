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

  // --- MÁSCARA DE TELEFONE ---
  const formatPhone = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, ""); // Remove letras
    const limited = value.slice(0, 11); // Limita tamanho
    return limited
      .replace(/^(\d{2})(\d)/g, "($1) $2") // (11) 9...
      .replace(/(\d)(\d{4})$/, "$1-$2"); // ...9999-9999
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  // Popula formulário ao abrir/editar
  useEffect(() => {
    if (isOpen) {
      if (restaurantToEdit) {
        setName(restaurantToEdit.name);
        // Aplica máscara ao carregar do banco
        setPhone(formatPhone(restaurantToEdit.cnpj));
        setEmail((restaurantToEdit as any).email || "");
        setCuisineType(restaurantToEdit.cuisineType || "");
        setAddress(restaurantToEdit.address);
      } else {
        // Limpa tudo para novo cadastro
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

    // 1. Sanitização
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanCuisine = cuisineType.trim();
    const cleanAddress = address.trim();

    // 2. Validações (Tratamento de Exceção)
    if (cleanName.length == 0) return alert ("Insira o nome do restaurante")
    if (cleanName.length < 3) return alert("Nome do restaurante muito curto.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) return alert("E-mail inválido.");

    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10)
      return alert("Telefone inválido (mínimo 10 dígitos).");

    if (cleanCuisine.length < 3) return alert("Informe o tipo de cozinha.");
    if (cleanAddress.length < 5) return alert("Endereço incompleto.");

    // 3. Envio Seguro
    onSave({
      id: restaurantToEdit?.id,
      name: cleanName,
      phone: cleanPhone,
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
          <Button
            onClick={onClose}
            style={{ backgroundColor: "#999", marginRight: "8px" }}
          >
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

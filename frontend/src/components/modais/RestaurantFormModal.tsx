import React, { useState, useEffect } from "react";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";

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

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Máscara de telefone
  const formatPhone = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, "");
    const limited = value.slice(0, 11);
    return limited
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  useEffect(() => {
    if (isOpen) {
      if (restaurantToEdit) {
        setName(restaurantToEdit.name);
        setPhone(formatPhone(restaurantToEdit.cnpj));
        setCuisineType(restaurantToEdit.cuisineType);
        setAddress(restaurantToEdit.address);

        if (restaurantToEdit.email) {
          setEmail(restaurantToEdit.email);
        } else {
          fetchFullDetails(restaurantToEdit.id);
        }
      } else {
        setName("");
        setPhone("");
        setEmail("");
        setCuisineType("");
        setAddress("");
      }
    }
  }, [isOpen, restaurantToEdit]);

  const fetchFullDetails = async (id: string) => {
    setIsLoadingDetails(true);
    try {
      const fullData = await restaurantService.getRestaurantById(id);
      if (fullData.email) setEmail(fullData.email);
      setName(fullData.name);
      setAddress(fullData.address);
      setCuisineType(fullData.cuisineType);
      setPhone(formatPhone(fullData.cnpj));
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanCuisine = cuisineType.trim();
    const cleanAddress = address.trim();

    if (cleanName.length < 3) return alert("Nome muito curto.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return alert("E-mail inválido.");
    if (cleanPhone.replace(/\D/g, "").length < 10)
      return alert("Telefone inválido.");
    if (cleanCuisine.length < 3) return alert("Tipo de cozinha inválido.");
    if (cleanAddress.length < 5) return alert("Endereço inválido.");

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
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={isLoadingDetails}
          >
            {isLoadingDetails
              ? "Carregando..."
              : restaurantToEdit
              ? "Salvar Alterações"
              : "Criar Restaurante"}
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
            disabled={isLoadingDetails}
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
            disabled={isLoadingDetails}
          />
          {isLoadingDetails && (
            <small style={{ color: "#666" }}>Buscando email...</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone / Contato</label>
          <Input
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            required
            maxLength={15}
            disabled={isLoadingDetails}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuisineType">Tipo de Cozinha</label>
          <Input
            id="cuisineType"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            required
            disabled={isLoadingDetails}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Endereço Completo</label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={isLoadingDetails}
          />
        </div>
      </form>
    </Modal>
  );
};

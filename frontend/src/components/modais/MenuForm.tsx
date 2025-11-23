import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { type IMenuItem } from "../../interfaces/IMenuItem";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: IMenuItem) => void;
  itemToEdit: IMenuItem | null;
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>(""); // String evita NaN no input
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setName(itemToEdit.name);
        setDescription(itemToEdit.description);
        setPrice(itemToEdit.price.toString());
        setCategory(itemToEdit.category);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
      }
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sanitização
    const cleanName = name.trim();
    const cleanCategory = category.trim();
    const cleanDescription = description.trim();

    // Converte vírgula para ponto caso o usuário use padrão brasileiro (ex: 10,50 -> 10.50)
    const numericPrice = parseFloat(price.replace(",", "."));

    // 2. Tratamento de Exceções
    if (cleanName.length < 2) {
      return alert("O nome do item deve ter pelo menos 2 letras.");
    }

    if (isNaN(numericPrice)) {
      return alert("O preço informado é inválido.");
    }

    if (numericPrice <= 0) {
      return alert("O preço deve ser maior que zero.");
    }

    if (cleanCategory.length < 2) {
      return alert("Informe a categoria do item (ex: Bebidas).");
    }

    const savedItem: IMenuItem = {
      id: itemToEdit?.id || "",
      name: cleanName,
      description: cleanDescription,
      price: numericPrice,
      category: cleanCategory,
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? "Editar Item" : "Adicionar Item"}
      footer={
        <>
          <Button
            onClick={onClose}
            style={{ backgroundColor: "#999", marginRight: "8px" }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} type="submit">
            Salvar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="name">Nome do Item</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: X-Bacon"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingredientes, detalhes..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço (R$)</label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="Ex: Lanches"
          />
        </div>
      </form>
    </Modal>
  );
};

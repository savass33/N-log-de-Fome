import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { type IMenuItem } from '../../interfaces/IMenuItem';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: IMenuItem) => void;
  itemToEdit: IMenuItem | null; // Se for nulo, é "Adicionar". Se não, é "Editar".
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  itemToEdit 
}) => {
  
  // Estado interno do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');

  // Efeito para popular o formulário se estivermos no modo "Editar"
  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setPrice(itemToEdit.price);
      setCategory(itemToEdit.category);
    } else {
      // Limpa o formulário se estivermos no modo "Adicionar"
      setName('');
      setDescription('');
      setPrice(0);
      setCategory('');
    }
  }, [itemToEdit, isOpen]); // Roda quando o item ou a visibilidade do modal muda

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simula a criação/atualização do item
    const savedItem: IMenuItem = {
      id: itemToEdit?.id || new Date().toISOString(), // ID mockado se for novo
      name,
      description,
      price,
      category,
      imageUrl: itemToEdit?.imageUrl || 'https://placehold.co/100', // Mock
    };
    
    onSave(savedItem);
    onClose(); // Fecha o modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Editar Item do Cardápio' : 'Adicionar Novo Item'}
      footer={
        <>
          <Button onClick={onClose} className="btn">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} type="submit">
            {itemToEdit ? 'Salvar Alterações' : 'Adicionar Item'}
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea 
            id="description" 
            className="textarea-field"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço (R$)</label>
          <Input 
            id="price" 
            type="number"
            step="0.01"
            value={price} 
            onChange={(e) => setPrice(parseFloat(e.target.value))} 
            required
          />
        </div>
         <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <Input 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="Ex: Pizzas, Bebidas, Sobremesas"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
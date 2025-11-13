import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) => {
  
  const handleConfirm = () => {
    onConfirm();
    onClose(); // Fecha o modal após confirmar
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button onClick={onClose} className="btn">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="btn">
            Confirmar
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};
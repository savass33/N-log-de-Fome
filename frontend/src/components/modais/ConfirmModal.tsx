import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";

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
  message,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            onClick={onClose}
            className="btn"
            style={{ backgroundColor: "#999", marginRight: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="btn"
            style={{ backgroundColor: "#d32f2f" }}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.5" }}>
        {message}
      </p>
    </Modal>
  );
};

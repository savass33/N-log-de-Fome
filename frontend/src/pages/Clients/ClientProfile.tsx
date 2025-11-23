import React, { useEffect, useState } from "react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import "./Client.css";
import { clientService } from "../../services/clientService";

export const ClientProfile: React.FC = () => {
  // Pegamos a nova função updateUserSession do hook
  const { user, updateUserSession } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (!phone && user.phone) setPhone(formatPhoneOnly(user.phone));
      if (!address) setAddress(user.address || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatPhoneOnly = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, "");
    if (value.length > 11) return value.slice(0, 11);
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneOnly(e.target.value);
    setPhone(formatted);
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) return alert("Nome obrigatório.");
      if (!phone.trim()) return alert("Telefone obrigatório.");

      const rawId = user?.id || "";
      const cleanId = rawId.replace(/\D/g, "");

      if (!cleanId) return alert("Erro de ID.");

      // 1. Atualiza no BANCO DE DADOS (Backend)
      await clientService.updateClient(cleanId, {
        name: name,
        phone: phone,
        address: address,
        email: user?.email,
      });

      // 2. CORREÇÃO DO ERRO: Atualiza a SESSÃO LOCAL (Frontend)
      updateUserSession({
        name: name,
        phone: phone,
        address: address,
      });

      alert("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil: ", error);
      alert("Erro ao salvar.");
    }
  };

  return (
    <div className="client-page-container">
      <h1>Meu Perfil</h1>
      <Card>
        <form
          className="profile-form profile-form-container"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              value={user?.email || ""}
              readOnly
              disabled
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Endereço Principal</label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, Número - Bairro"
              maxLength={100}
            />
          </div>
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
};

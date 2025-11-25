import React, { useEffect, useState } from "react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import "./Client.css";
import { clientService } from "../../services/clientService";

export const ClientProfile: React.FC = () => {
  const { user, updateUserSession } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.phone) setPhone(formatPhoneOnly(user.phone));
      if (user.address) setAddress(user.address || "");
    }
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
    setPhone(formatPhoneOnly(e.target.value));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyLetters = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");

    setName(onlyLetters);
  };


  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanName.length < 3) return alert("Nome inválido (mínimo 3 letras).");
    if (cleanPhone.length < 10) return alert("Telefone inválido.");
    if (cleanAddress.length < 5) return alert("Endereço incompleto.");

    const rawId = user?.id || "";
    const cleanId = rawId.replace(/\D/g, "");

    if (!cleanId) return alert("Erro de sessão. Faça login novamente.");

    setIsSaving(true);
    try {
      await clientService.updateClient(cleanId, {
        name: cleanName,
        phone: phone,
        address: cleanAddress,
        email: user?.email,
      });

      updateUserSession({
        name: cleanName,
        phone: phone,
        address: cleanAddress,
      });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil: ", error);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setIsSaving(false);
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
              onChange={handleNameChange}
              placeholder="Digite seu nome"
              maxLength={100}
              disabled={isSaving}
            />

          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              value={user?.email || ""}
              readOnly
              disabled
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </div>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

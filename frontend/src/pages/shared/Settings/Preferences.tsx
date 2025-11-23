import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common/Card";
import { Button } from "../../../components/common/Button";
import "./Settings.css";

export const Preferences: React.FC = () => {
  // Inicia estados lendo do LocalStorage ou usa padrão
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("pref_darkMode");
    return saved === "true";
  });

  const [emailNotify, setEmailNotify] = useState(() => {
    const saved = localStorage.getItem("pref_emailNotify");
    return saved === "true"; // Padrão false se não existir, ou mude para !== 'false' para padrão true
  });

  // Efeito para aplicar mudanças visuais (Ex: Dark Mode) em tempo real
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme"); // Supondo que você tenha CSS para isso
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const handleSave = () => {
    try {
      // Salva no navegador do usuário
      localStorage.setItem("pref_darkMode", String(darkMode));
      localStorage.setItem("pref_emailNotify", String(emailNotify));

      alert("Preferências salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar preferências.");
    }
  };

  return (
    <div className="settings-page-container">
      <h1>Preferências</h1>
      <Card title="Aparência e Notificações">
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
              />
              <span className="slider round"></span>
            </label>
            <label htmlFor="darkMode" className="toggle-label">
              Modo Escuro (Tema)
              <small
                style={{
                  display: "block",
                  color: "#666",
                  fontWeight: "normal",
                }}
              >
                Altera a aparência da aplicação para cores escuras.
              </small>
            </label>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          <div className="form-group-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="emailNotify"
                checked={emailNotify}
                onChange={() => setEmailNotify((prev) => !prev)}
              />
              <span className="slider round"></span>
            </label>
            <label htmlFor="emailNotify" className="toggle-label">
              Notificações por E-mail
              <small
                style={{
                  display: "block",
                  color: "#666",
                  fontWeight: "normal",
                }}
              >
                Receba atualizações sobre o status dos seus pedidos.
              </small>
            </label>
          </div>

          <Button
            onClick={handleSave}
            type="button"
            style={{ marginTop: "20px" }}
          >
            Salvar Preferências
          </Button>
        </form>
      </Card>
    </div>
  );
};

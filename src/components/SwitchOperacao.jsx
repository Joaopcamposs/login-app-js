import React from 'react';
import './styles/SwitchOperacao.css';

export default function SwitchOperacao({ value, onChange }) {
  return (
    <div className="switch-container">
      <button
        className={`switch-button ${value === 'consultar' ? 'active' : ''}`}
        onClick={() => onChange('consultar')}
      >
        Consultar
      </button>
      <button
        className={`switch-button ${value === 'cadastrar' ? 'active' : ''}`}
        onClick={() => onChange('cadastrar')}
      >
        Cadastrar
      </button>
    </div>
  );
}

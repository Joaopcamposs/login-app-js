import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarLocacao from './ConsultarLocacao';
import CadastrarLocacao from './CadastrarLocacao';

export default function Locacao() {
  const location = useLocation();
  const navigate = useNavigate();

  const operacao = location.pathname.split('/')[3] || 'consultar';

  const handleChange = (novoValor) => {
    navigate(`/inicio/locacao/${novoValor}`);
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Locações</h1>
      <SwitchOperacao value={operacao} onChange={handleChange} />

      {operacao === 'consultar' ? <ConsultarLocacao /> : <CadastrarLocacao />}
    </div>
  );
}

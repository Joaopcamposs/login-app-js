import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarTraje from './ConsultarTraje';
import CadastrarTraje from './CadastrarTraje';

export default function Trajes() {
  const location = useLocation();
  const navigate = useNavigate();

  const operacao = location.pathname.split('/')[3] || 'consultar';

  const handleChange = (novoValor) => {
    navigate(`/inicio/trajes/${novoValor}`);
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Trajes</h1>
      <SwitchOperacao value={operacao} onChange={handleChange} />

      {operacao === 'consultar' ? <ConsultarTraje /> : <CadastrarTraje />}
    </div>
  );
}

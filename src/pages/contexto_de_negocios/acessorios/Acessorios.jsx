import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarAcessorio from './ConsultarAcessorio';
import CadastrarAcessorio from './CadastrarAcessorio';

export default function Acessorios() {
  const location = useLocation();
  const navigate = useNavigate();

  const operacao = location.pathname.split('/')[3] || 'consultar';

  const handleChange = (novoValor) => {
    navigate(`/inicio/acessorios/${novoValor}`);
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Acessórios</h1>
      <SwitchOperacao value={operacao} onChange={handleChange} />

      {operacao === 'consultar' ? <ConsultarAcessorio /> : <CadastrarAcessorio />}
    </div>
  );
}

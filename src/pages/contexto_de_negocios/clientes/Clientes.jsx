import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarCliente from './ConsultarCliente';
import CadastrarCliente from './CadastrarCliente';

export default function Clientes() {
  const location = useLocation();
  const navigate = useNavigate();

  const operacao = location.pathname.split('/')[3] || 'consultar';

  const handleChange = (novoValor) => {
    navigate(`/inicio/clientes/${novoValor}`);
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Clientes</h1>
      <SwitchOperacao value={operacao} onChange={handleChange} />

      {operacao === 'consultar' ? <ConsultarCliente /> : <CadastrarCliente />}
    </div>
  );
}

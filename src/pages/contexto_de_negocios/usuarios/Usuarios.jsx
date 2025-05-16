import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarUsuario from './ConsultarUsuario';
import CadastrarUsuario from './CadastrarUsuario';

export default function Usuarios() {
  const location = useLocation();
  const navigate = useNavigate();

  const operacao = location.pathname.split('/')[3] || 'consultar';

  const handleChange = (novoValor) => {
    navigate(`/inicio/usuarios/${novoValor}`);
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Usuarios</h1>
      <SwitchOperacao value={operacao} onChange={handleChange} />

      {operacao === 'consultar' ? <ConsultarUsuario /> : <CadastrarUsuario />}
    </div>
  );
}

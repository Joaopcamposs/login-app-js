import React, { useState } from 'react';
import SwitchOperacao from '../../../components/SwitchOperacao';
import ConsultarLocacao from './ConsultarLocacao';
import CadastrarLocacao from './CadastrarLocacao';

export default function Locacao() {
  const [operacao, setOperacao] = useState('consultar');

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Gestão de Locações</h1>
      <SwitchOperacao value={operacao} onChange={setOperacao} />

      <div style={{ marginTop: '24px' }}>
        {operacao === 'consultar' ? <ConsultarLocacao /> : <CadastrarLocacao />}
      </div>
    </div>
  );
}

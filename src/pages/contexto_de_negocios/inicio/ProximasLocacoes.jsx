import './styles/ProximasLocacoes.css'
import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import moment from 'moment';
import ErrorMessage from '../../../components/ErrorMessage';


function obterQuantidadeDeDiasRestantesNaSemana() {
  // Lógica para calcular a data do próximo domingo com base nos dias restantes
  const today = new Date();
  const diasRestantes = 7 - today.getDay(); // Dias restantes até o próximo domingo
  if (diasRestantes === 7) {
    return 6;
  }
  return diasRestantes;
}


export default function ProximasLocacoes() {
  const [dataInicial, setDataInicial] = useState(moment().format('YYYY-MM-DD'));
  const [dataFinal, setDataFinal] = useState(moment().add(obterQuantidadeDeDiasRestantesNaSemana(), 'days').format('YYYY-MM-DD'));
  const [locacoes, setLocacoes] = useState([])
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [locacaoEncontrado, setLocacaoEncontrado] = useState(undefined);
  const [mensagemErro, setMensagemErro] = useState('');


  const { makeRequest } = useAxiosWithTimeout();


  const buscarLocacoes = async () => {
    try {
      setIsLoadingBusca(true)
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?data_inicial=${dataInicial}&data_final=${dataFinal}`,
        method: 'GET',
      });
      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacoes(response.data);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false)
    }
  }


  function formatarData(dataISO) {
    const data = new Date(dataISO);
    data.setHours(data.getHours() + data.getTimezoneOffset() / 60);
    // Ajuste a hora para considerar a diferença de fuso horário
    const dia = (`0${data.getDate()}`).slice(-2);
    const mes = (`0${data.getMonth() + 1}`).slice(-2);
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  useEffect(() => {
    buscarLocacoes();
  }, [dataInicial, dataFinal]);

  const renderContent = () => {
    if (isLoadingBusca) {
      return <div className="loading-message"><CircularProgress
      style={{ position: 'absolute', top: '50%', left: '50%' }}
    /></div>
    }

    const locacoesArray = Array.isArray(locacoes) ? locacoes : []

    if (locacoesArray.length === 0) {
      return <div className="empty-message">Nenhuma locação encontrada para o período selecionado</div>
    }

    return (
      <table className="locacoes-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Dama</th>
            <th>Idade</th>
            <th>Data Retirada</th>
            <th>Data Evento</th>
            <th>Valor Restante</th>
            <th>Observações</th>
            <th>Códigos Trajes</th>
            <th>Descrição Trajes</th>
            <th>Tamanhos</th>
            <th>Códigos Acessórios</th>
            <th>Descrição Acessórios</th>
          </tr>
        </thead>
        <tbody>
          {locacoesArray.map((locacao, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'linha-par' : 'linha-impar'}>
              <td>{locacao.nome_cliente}</td>
              <td>{locacao.nome_dama}</td>
              <td>{locacao.idade}</td>
              <td>{formatarData(locacao.data_retirada)}</td>
              <td>{formatarData(locacao.data_evento)}</td>
              <td>{locacao.valor_restante}</td>
              <td>{locacao.observacoes}</td>
              <td>{locacao.trajes_locados.map(
                      (traje) => traje.codigo
                    ).join("; ")}</td>
              <td>{locacao.trajes_locados.map(
                      (traje) => traje.descricao
                    ).join("; ")}</td>
              <td>{locacao.trajes_locados.map(
                      (traje) => traje.tamanho
                    ).join("; ")}</td>
              <td>{locacao.acessorios_locados.map(
                      (acessorio) => acessorio.codigo
                    ).join("; ")}</td>
              <td>{locacao.acessorios_locados.map(
                      (acessorio) => acessorio.descricao
                    ).join("; ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Locações dos próximos dias:</h1>
      <div className="filters">
        <label>De:
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
        </label>
        <label>Até:
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
        </label>
        {mensagemErro && <ErrorMessage message={mensagemErro} />}
      </div>
      {renderContent()}
    </div>
  )
}

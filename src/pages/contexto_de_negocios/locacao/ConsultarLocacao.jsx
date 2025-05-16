import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Checkbox,
  IconButton,
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment/moment';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function ConsultarLocacao() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isAttChecked, setIsAttChecked] = useState(false);
  const [isDelChecked, setIsDelChecked] = useState(false);
  const [locacaoEncontrado, setLocacaoEncontrado] = useState(undefined);
  const [locacaoAtualizado, setLocacaoAtualizado] = useState(undefined);
  const [locacaoDeletado, setLocacaoDeletado] = useState(undefined);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [flagSucesso, setFlagSucesso] = useState(false);
  const [codigoLocacao, setCodigoLocacao] = useState('');
  const [cpfCliente, setCpf] = useState('');
  const [clientes, setClientes] = useState([{ nome: '' }]);
  const [usuarios, setUsuarios] = useState([]);
  const [trajes, setTrajes] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [nomeCliente, setNomeCliente] = useState(undefined);
  const [formValues, setFormValues] = useState({
    nome_cliente: '',
    nome_dama: '',
    nome_noiva: '',
    idade: '',
    cpf: '',
    data_venda: undefined,
    data_evento: '',
    data_retirada: '',
    data_devolucao: '',
    valor_total: '',
    valor_desconto: 0,
    valor_final: '',
    valor_entrada: 0,
    valor_restante: '',
    observacoes: '',
    vendedor: '',

    codigo_trajes: [],
    descricao_trajes: [],
    tamanho_trajes: [],
    valor_trajes: [],

    codigo_acessorios: [],
    descricao_acessorios: [],
    valor_acessorios: [],
  });

  const [trajeSelecionado, setTrajeSelecionado] = useState({});
  const [trajesSelecionados, setTrajesSelecionados] = useState([]);
  const [newTrajesSelecionados] = useState([]);

  const [acessorioSelecionado, setAcessorioSelecionado] = useState({});
  const [acessoriosSelecionados, setAcessoriosSelecionados] = useState([]);
  const [newAcessoriosSelecionados] = useState([]);

  const [dep, setDep] = useState();
  const { makeRequest } = useAxiosWithTimeout();

  function resetarCheckbox() {
    setIsAttChecked(false);
    setIsDelChecked(false);
  }

  function limparCampos() {
    setCodigoLocacao('');
    resetarCheckbox();
  }

  async function preencherForms(locacao) {
    setFormValues({
      nome_cliente: locacao.nome_cliente || '',
      nome_dama: locacao.nome_dama || '',
      nome_noiva: locacao.nome_noiva || '',
      idade: locacao.idade || '',
      cpf: locacao.cpf || '',
      data_venda: locacao.data_venda || undefined,
      data_evento: locacao.data_evento || '',
      data_retirada: locacao.data_retirada || '',
      data_devolucao: locacao.data_devolucao || '',
      valor_total: locacao.valor_total || '',
      valor_desconto: locacao.valor_desconto || 0,
      valor_final: locacao.valor_final || '',
      valor_entrada: locacao.valor_entrada || 0,
      valor_restante: locacao.valor_restante || '',
      observacoes: locacao.observacoes || '',
      vendedor: locacao.vendedor || '',

      codigo_trajes: locacao.trajes_locados.map((traje) => traje.codigo_traje),
      descricao_trajes: locacao.trajes_locados.map((traje) => traje.descricao),
      tamanho_trajes: locacao.trajes_locados.map((traje) => traje.tamanho),
      valor_trajes: locacao.trajes_locados.map((traje) => traje.valor),

      codigo_acessorios: locacao.acessorios_locados.map(
        (acessorio) => acessorio.codigo_acessorio,
      ),
      descricao_acessorios: locacao.acessorios_locados.map((acessorio) => acessorio.descricao),
      valor_acessorios: locacao.acessorios_locados.map((acessorio) => acessorio.valor),
    });
  }

  const buscarClientes = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/clientes`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const clientesOrdenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        // ordena o array pelo nome ordem crescente
        setClientes(clientesOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const buscarUsuarios = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/usuarios`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const usuariosOrdenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        // ordena o array pelo nome ordem crescente
        setUsuarios(usuariosOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const buscarTrajes = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/trajes`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const trajesOrdenados = response.data.sort((a, b) => a.codigo - b.codigo);
        // ordena o array pelo código em ordem crescente
        setTrajes(trajesOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const buscarAcessorios = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorios`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const acessoriosOrdenados = response.data.sort((a, b) => a.codigo - b.codigo);
        // ordena o array pelo código em ordem crescente
        setAcessorios(acessoriosOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };

  const handleBuscarPorCodigo = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?codigo=${codigoLocacao}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        resetarCheckbox();
        await preencherForms(response.data[0]);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleBuscarPorCPF = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?ultima_no_cpf=${cpfCliente}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        resetarCheckbox();
        await preencherForms(response.data[0]);
        setCodigoLocacao(response.data[0].codigo);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleBuscarTodasPorCPF = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?todas_no_cpf=${cpfCliente}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data && response.data.length > 0) {
        setLocacaoEncontrado(false);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        resetarCheckbox();
        let codigosLocados = '';
        response.data.forEach((locacao) => {
          codigosLocados += `${locacao.codigo}, `;
        });
        // Remover a vírgula extra no final da string
        codigosLocados = codigosLocados.slice(0, -2);
        const mensagem = `Codigos de locações para ${response.data[0].nome_cliente} no cpf ${cpfCliente}: ${codigosLocados}`;
        setMensagemErro(mensagem);
      } else if (response.status === 200 && response.data) {
        const mensagem = `Nenhuma locação encontrada para o CPF ${cpfCliente}!`;
        setMensagemErro(mensagem);
        setLocacaoEncontrado(false);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleAtualizarLocacao = async () => {
    setIsLoadingAtt(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacao_completa?codigo=${codigoLocacao}`,
        data: formValues,
        method: 'PUT',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Locação atualizada com sucesso!');
        resetarCheckbox();
        await preencherForms(
          response.data,
        );
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar locação: ${erro}`);
      setLocacaoEncontrado(false);
      setLocacaoAtualizado(false);
      setMensagemSucesso('');
    } finally {
      setIsLoadingAtt(false);
    }
  };

  const handleDeletarLocacao = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacao_completa?codigo=${codigoLocacao}`,
        method: 'DELETE',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(false); // flag invertida, deletar componentes
        setLocacaoDeletado(true);
        setMensagemErro('');
        setFlagSucesso(true);
        setMensagemSucesso('Locacao deletada com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar locação: ${erro}`);
      setLocacaoEncontrado(true); // flag invertida
      setLocacaoDeletado(false);
      setMensagemSucesso('');
    }

    setIsLoadingDel(false);
  };

  const handleCheckboxAttChange = (event) => {
    setIsAttChecked(event.target.checked);
  };

  const handleCheckboxDelChange = (event) => {
    setIsDelChecked(event.target.checked);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setFlagSucesso(false);
  };

  const handleAutocompleteChange = (event, newValue) => {
    setNomeCliente(newValue);
    const selectedClient = clientes.find((client) => client.nome === newValue.nome);
    setCpf(selectedClient.cpf);
  };

  const atualizarValores = () => {
    const valorTrajes = formValues.valor_trajes.reduce(
      (acc, cur) => acc + cur,
      0,
    );
    const valorAcessorios = formValues.valor_acessorios.reduce(
      (acc, cur) => acc + cur,
      0,
    );
    const valorTotal = valorTrajes + valorAcessorios;
    const valorFinal = valorTotal - formValues.valor_desconto;
    const valorRestante = valorFinal - formValues.valor_entrada;

    setFormValues((prevValues) => ({
      ...prevValues,
      valor_total: valorTotal,
    }));
    setFormValues((prevValues) => ({
      ...prevValues,
      valor_final: valorFinal,
    }));
    setFormValues((prevValues) => ({
      ...prevValues,
      valor_restante: valorRestante,
    }));
  };

  const handleUpdateFormsTrajes = (newTraje, shouldAdd) => {
    const newFormValues = { ...formValues };

    if (shouldAdd) {
      newFormValues.codigo_trajes.push(newTraje.codigo);
      newFormValues.descricao_trajes.push(newTraje.descricao);
      newFormValues.tamanho_trajes.push(newTraje.tamanho);
      newFormValues.valor_trajes.push(newTraje.valor);
    } else {
      const index = newTraje; // no else, o newTraje é o index do array
      newFormValues.codigo_trajes.splice(index, 1);
      newFormValues.descricao_trajes.splice(index, 1);
      newFormValues.tamanho_trajes.splice(index, 1);
      newFormValues.valor_trajes.splice(index, 1);
    }

    setFormValues(newFormValues);
    atualizarValores();
  };

  const handleTrajeSelecionadoChange = (event) => {
    const codigo = event.target.value;
    const trajeSelecionadoAtual = trajes.find(
      (traje) => traje.codigo === codigo,
    );
    const newTraje = { ...trajeSelecionadoAtual };
    const isTrajeSelecionado = trajesSelecionados.find(
      (traje) => traje.codigo === newTraje.codigo,
    );
    if (!isTrajeSelecionado) {
      const newTajesSelecionados = [...trajesSelecionados, newTraje];
      setTrajesSelecionados(newTajesSelecionados);
    }
    setTrajeSelecionado(newTraje);
    handleUpdateFormsTrajes(newTraje, true);
  };

  const handleTrajeRemovido = (trajeIndex) => {
    setTrajesSelecionados((prevState) => prevState.filter((_, index) => index !== trajeIndex));
    handleUpdateFormsTrajes(trajeIndex, false);
  };

  const handleUpdateFormsAcessorios = (newAcessorio, shouldAdd) => {
    const newFormValues = { ...formValues };

    if (shouldAdd) {
      newFormValues.codigo_acessorios.push(newAcessorio.codigo);
      newFormValues.descricao_acessorios.push(newAcessorio.descricao);
      newFormValues.valor_acessorios.push(newAcessorio.valor);
    } else {
      const index = newAcessorio; // no else, o newAcessorio é o index do array
      newFormValues.codigo_acessorios.splice(index, 1);
      newFormValues.descricao_acessorios.splice(index, 1);
      newFormValues.valor_acessorios.splice(index, 1);
    }

    setFormValues(newFormValues);
    atualizarValores();
  };

  const handleAcessorioSelecionadoChange = (event) => {
    const codigo = event.target.value;
    const acessorioSelecionadoAtual = acessorios.find(
      (acessorio) => acessorio.codigo === codigo,
    );
    const newAcessorio = { ...acessorioSelecionadoAtual };
    const isAcessorioSelecionado = acessoriosSelecionados.find(
      (acessorio) => acessorio.codigo === newAcessorio.codigo,
    );
    if (!isAcessorioSelecionado) {
      const newAcessoriosSelecionadosAtual = [
        ...acessoriosSelecionados,
        newAcessorio,
      ];
      setAcessoriosSelecionados(newAcessoriosSelecionadosAtual);
    }
    setAcessorioSelecionado(newAcessorio);
    handleUpdateFormsAcessorios(newAcessorio, true);
  };

  const handleAcessorioRemovido = (acessorioIndex) => {
    setAcessoriosSelecionados((prevState) => (
      prevState.filter((_, index) => index !== acessorioIndex)));
    handleUpdateFormsAcessorios(acessorioIndex, false);
  };

  const handleChangeDataEvento = (event) => {
    const { name, value } = event.target;

    // transforma a data do evento em um objeto Moment.js
    const dataEvento = moment(value);

    let dataRetirada = dataEvento.clone();
    let dataDevolucao = dataEvento.clone();

    // se o evento for no sábado
    if (dataEvento.day() === 6) {
      // 6 é o índice do sábado no Moment.js
      dataRetirada = dataEvento.clone().subtract(1, 'day');
      dataDevolucao = dataEvento.clone().add(2, 'day');
    } else if (dataEvento.day() === 1) {
      // se o evento for na segunda-feira - 1 é o índice da segunda-feira no Moment.js
      dataRetirada = dataEvento.clone().subtract(2, 'day');
      dataDevolucao = dataEvento.clone().add(1, 'day');
    } else {
      dataRetirada = dataEvento.clone().subtract(1, 'day');
      dataDevolucao = dataEvento.clone().add(1, 'day');
    }

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
      data_retirada: dataRetirada.format('YYYY-MM-DD'),
      data_devolucao: dataDevolucao.format('YYYY-MM-DD'),
    }));
  };

  useEffect(() => {
    buscarClientes();
    buscarUsuarios();
    buscarTrajes();
    buscarAcessorios();
    atualizarValores();
    // eslint-disable-next-line
    }, [newTrajesSelecionados, newAcessoriosSelecionados, dep]);

  return (
        <div>
            <div className="inline-container" style={{ display: 'flex' }}>
                <form onSubmit={handleBuscarPorCodigo}>
                    <TextField
                        label="Codigo da locação"
                        type="number"
                        value={codigoLocacao}
                        onChange={(e) => setCodigoLocacao(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <Button type="submit" variant="contained" disabled={isLoadingBusca}>
                        {isLoadingBusca ? <CircularProgress size={24}/> : 'Buscar por Codigo'}
                    </Button>
                </form>
                <form onSubmit={handleBuscarPorCPF} style={{ marginBottom: '16px', marginLeft: '20px' }}>
                    <TextField
                        label="CPF do Cliente"
                        type="tel"
                        value={cpfCliente}
                        onChange={(e) => setCpf(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        autoFocus
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoadingBusca}
                    >
                        {isLoadingBusca ? <CircularProgress size={24}/> : 'Buscar por CPF'}
                    </Button>
                </form>
                <form style={{ marginBottom: '16px', marginLeft: '20px' }}>
                    <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => option.nome}
                        value={nomeCliente}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => <TextField {...params} label="Nome do Cliente"/>}
                        required
                        style={{ width: 340 }}
                    />
                </form>
                <form onSubmit={handleBuscarTodasPorCPF} style={{ marginBottom: '16px', marginLeft: '20px' }}>
                    <TextField
                        label="CPF do Cliente"
                        type="tel"
                        value={cpfCliente}
                        onChange={(e) => setCpf(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        autoFocus
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoadingBusca}
                    >
                        {isLoadingBusca ? <CircularProgress size={24}/> : 'Lista Codigos por CPF'}
                    </Button>
                </form>
            </div>

            {locacaoEncontrado === undefined ? (
                <div></div>
            ) : locacaoEncontrado ? (
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Typography variant="h6" style={{ marginTop: '16px' }}>
                            Locação
                        </Typography>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="nome_cliente"
                                label="Nome do Cliente"
                                value={formValues.nome_cliente}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="nome_dama"
                                label="Nome da Dama"
                                value={formValues.nome_dama}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="nome_noiva"
                                label="Nome da Noiva"
                                value={formValues.nome_noiva}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="idade"
                                label="Idade"
                                type="number"
                                value={formValues.idade}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="cpf"
                                label="CPF"
                                type="tel"
                                value={formValues.cpf}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="data_venda"
                                label="Data da Venda"
                                type="date"
                                value={formValues.data_venda}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="data_evento"
                                label="Data do Evento"
                                type="date"
                                value={formValues.data_evento}
                                onChange={handleChangeDataEvento}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="data_retirada"
                                label="Data da Retirada"
                                type="date"
                                value={formValues.data_retirada}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="data_devolucao"
                                label="Data da Devolução"
                                type="date"
                                value={formValues.data_devolucao}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="valor_total"
                                label="Valor Total"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                  ),
                                }}
                                value={formValues.valor_total}
                                onChange={(event) => {
                                  handleChange(event);
                                  setDep((prevDep) => !prevDep);
                                }}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="valor_desconto"
                                label="Valor do Desconto"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                  ),
                                }}
                                value={formValues.valor_desconto}
                                onChange={(event) => {
                                  handleChange(event);
                                  setDep((prevDep) => !prevDep);
                                }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="valor_final"
                                label="Valor Final"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                  ),
                                }}
                                value={formValues.valor_final}
                                onChange={(event) => {
                                  handleChange(event);
                                  setDep((prevDep) => !prevDep);
                                }}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="valor_entrada"
                                label="Valor da Entrada"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                  ),
                                }}
                                value={formValues.valor_entrada}
                                onChange={(event) => {
                                  handleChange(event);
                                  setDep((prevDep) => !prevDep);
                                }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="valor_restante"
                                label="Valor Restante"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                  ),
                                }}
                                value={formValues.valor_restante}
                                onChange={(event) => {
                                  handleChange(event);
                                  setDep((prevDep) => !prevDep);
                                }}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <TextField
                                name="observacoes"
                                label="Observações"
                                value={formValues.observacoes}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 250 }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <FormControl fullWidth>
                                <InputLabel id="vendedor-select-label">Vendedor</InputLabel>
                                <Select
                                    MenuProps={{ style: { maxHeight: 300 } }}
                                    labelId="vendedor-select-label"
                                    id="vendedor-select"
                                    name="vendedor"
                                    value={formValues.vendedor}
                                    onChange={handleChange}
                                    required
                                >
                                    {usuarios.map((usuario) => (
                                        <MenuItem key={usuario.nome} value={usuario.nome}>
                                            {usuario.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <Checkbox
                                checked={isAttChecked}
                                onChange={handleCheckboxAttChange}
                            />
                            Desejo atualizar os dados da locação
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '5px' }}>
                            <Button
                                variant="contained"
                                onClick={handleAtualizarLocacao}
                                disabled={!isAttChecked}
                                color="warning"
                            >
                                {isLoadingAtt ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '16px' }}>
                            <Checkbox
                                checked={isDelChecked}
                                onChange={handleCheckboxDelChange}
                            />
                            Desejo deletar a locação
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '5px' }}>
                            <Button
                                variant="contained"
                                onClick={handleDeletarLocacao}
                                disabled={!isDelChecked}
                                color="error"
                            >
                                {isLoadingDel ? 'Deletando...' : 'Deletar'}
                            </Button>
                        </Grid>
                        {locacaoAtualizado ? (
                            <SuccessMessage
                                open={flagSucesso}
                                message={mensagemSucesso}
                                onClose={handleClose}/>
                        ) : undefined}
                    </Grid>

                    <Grid item xs={3}>
                        <Typography variant="h6" style={{ marginTop: '16px' }}>
                            Trajes Locados
                        </Typography>
                        <FormControl fullWidth style={{ marginTop: '17px' }}>
                            <InputLabel id="trajes-select-label">Trajes</InputLabel>
                            <Select
                                MenuProps={{ style: { maxHeight: 300 } }}
                                labelId="trajes-select-label"
                                id="trajes-select"
                                value={trajeSelecionado.codigo || ''}
                                onChange={handleTrajeSelecionadoChange}
                            >
                                {trajes.map((traje) => (
                                    <MenuItem key={traje.codigo} value={traje.codigo}>
                                        {traje.codigo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div
                            style={{
                              border: '1px solid #ccc',
                              padding: '10px',
                              marginBottom: '10px',
                              // marginTop: "16px",
                            }}
                        >
                            {formValues.codigo_trajes.map((codigo, index) => (
                                <div
                                    key={`traje-${index}`}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                    }}
                                >
                                    <TextField
                                        name="codigo_traje"
                                        label="Código"
                                        disabled={false}
                                        value={formValues.codigo_trajes[index]}
                                        onChange={(e) => {
                                          const newValue = formValues.codigo_trajes.slice();
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            codigo_trajes: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        name="tamanho_traje"
                                        label="Tamanho"
                                        disabled={false}
                                        value={formValues.tamanho_trajes[index]}
                                        onChange={(e) => {
                                          const newValue = formValues.tamanho_trajes.slice();
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            tamanho_trajes: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        style={{ marginTop: '16px' }}
                                    />
                                    <TextField
                                        name="descricao_traje"
                                        label="Descrição"
                                        disabled={false}
                                        value={formValues.descricao_trajes[index]}
                                        onChange={(e) => {
                                          const newValue = formValues.descricao_trajes.slice();
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            descricao_trajes: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        style={{ marginTop: '16px' }}
                                    />
                                    <TextField
                                        name="valor_traje"
                                        label="Valor"
                                        disabled={false}
                                        value={formValues.valor_trajes[index]}
                                        onChange={(e) => {
                                          const newValue = formValues.valor_trajes.slice();
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            valor_trajes: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        style={{ marginTop: '16px' }}
                                    />
                                    <IconButton onClick={() => handleTrajeRemovido(index)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography variant="h6" style={{ marginTop: '16px' }}>
                            Acessórios Locados
                        </Typography>
                        <FormControl fullWidth style={{ marginTop: '16px' }}>
                            <InputLabel id="acessorios-select-label">
                                Acessórios
                            </InputLabel>
                            <Select
                                MenuProps={{ style: { maxHeight: 300 } }}
                                labelId="acessorios-select-label"
                                id="acessorios-select"
                                value={acessorioSelecionado.codigo || ''}
                                onChange={handleAcessorioSelecionadoChange}
                            >
                                {acessorios.map((acessorio) => (
                                    <MenuItem key={acessorio.codigo} value={acessorio.codigo}>
                                        {acessorio.codigo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div
                            style={{
                              border: '1px solid #ccc',
                              padding: '10px',
                              marginBottom: '10px',
                            }}
                        >
                            {formValues.codigo_acessorios.map((codigo, index) => (
                                <div
                                    key={`acessorio-${index}`}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                    }}
                                >
                                    <TextField
                                        name="codigo_acessorio"
                                        label="Código"
                                        disabled={false}
                                        value={formValues.codigo_acessorios[index]}
                                        onChange={(e) => {
                                          const newValue = Array.from(formValues.codigo_acessorios);
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            codigo_acessorios: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        name="descricao_acessorio"
                                        label="Descrição"
                                        disabled={false}
                                        value={formValues.descricao_acessorios[index]}
                                        onChange={(e) => {
                                          const newValue = Array.from(
                                            formValues.descricao_acessorios,
                                          );
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            descricao_acessorios: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        style={{ marginTop: '16px' }}
                                    />
                                    <TextField
                                        name="valor_acessorio"
                                        label="Valor"
                                        disabled={false}
                                        value={formValues.valor_acessorios[index]}
                                        onChange={(e) => {
                                          const newValue = Array.from(formValues.valor_acessorios);
                                          newValue[index] = e.target.value;
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            valor_acessorios: newValue,
                                          }));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        style={{ marginTop: '16px' }}
                                    />
                                    <IconButton onClick={() => handleAcessorioRemovido(index)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid>
            ) : (
                <div>
                    <ErrorMessage message={mensagemErro}/>
                    {locacaoDeletado ? (
                        <SuccessMessage
                            open={flagSucesso}
                            message={mensagemSucesso}
                            onClose={handleClose}/>
                    ) : undefined}
                </div>
            )}
        </div>
  );
}

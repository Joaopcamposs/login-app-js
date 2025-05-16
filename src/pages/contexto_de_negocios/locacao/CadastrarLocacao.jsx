import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Typography,
  Container,
  IconButton,
  Autocomplete,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function CadastrarLocacao() {
  const [formValues, setFormValues] = useState({
    nome_cliente: '',
    nome_dama: '',
    nome_noiva: '',
    idade: '',
    cpf: '',
    data_venda: new Date().toISOString().split('T')[0],
    data_evento: '',
    data_retirada: '',
    data_devolucao: '',
    valor_desconto: 0,
    valor_entrada: 0,
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

  const [trajes, setTrajes] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [clientes, setClientes] = useState([{ nome: '' }]);
  const [usuarios, setUsuarios] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [valorFinal, setValorFinal] = useState(0);
  const [valorRestante, setValorRestante] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [flagSucesso, setFlagSucesso] = useState(false);
  const [locacaoCadastrada, setLocacaoCadastrada] = useState(undefined);

  const [trajeSelecionado, setTrajeSelecionado] = useState({});
  const [trajesSelecionados, setTrajesSelecionados] = useState([]);
  let [newTrajesSelecionados] = useState([]);

  const [acessorioSelecionado, setAcessorioSelecionado] = useState({});
  const [acessoriosSelecionados, setAcessoriosSelecionados] = useState([]);
  let [newAcessoriosSelecionados] = useState([]);

  const [nomeCliente, setNomeCliente] = useState(clientes[0]);
  const [dep, setDep] = useState();
  const { makeRequest } = useAxiosWithTimeout();

  const limparCampos = () => {
    setFormValues({
      nome_cliente: '',
      nome_dama: '',
      nome_noiva: '',
      idade: '',
      cpf: '',
      data_venda: '',
      data_evento: '',
      data_retirada: '',
      data_devolucao: '',
      valor_desconto: '',
      valor_entrada: '',
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
    setAcessorioSelecionado({});
    setTrajeSelecionado({});
    setTrajesSelecionados([]);
    setAcessoriosSelecionados([]);
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

  const atualizarValores = () => {
    const valorTrajes = formValues.valor_trajes.reduce(
      (acc, cur) => acc + cur,
      0,
    );
    const valorAcessorios = formValues.valor_acessorios.reduce(
      (acc, cur) => acc + cur,
      0,
    );

    // Gambiarra para atualizar valores em tempo real
    const valorTotal = valorTrajes + valorAcessorios;
    const valorFinal = valorTotal - formValues.valor_desconto;
    const valorRestante = valorFinal - formValues.valor_entrada;

    setValorTotal(valorTotal);
    setValorFinal(valorFinal);
    setValorRestante(valorRestante);
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
      const newTrajesSelecionadosAtual = [...trajesSelecionados, newTraje];
      setTrajesSelecionados(newTrajesSelecionadosAtual);
    }
    setTrajeSelecionado(newTraje);
    handleUpdateFormsTrajes(newTraje, true);
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

  const handleTrajeRemovido = (trajeIndex) => {
    setTrajesSelecionados((prevState) => prevState.filter((_, index) => index !== trajeIndex));
    handleUpdateFormsTrajes(trajeIndex, false);
  };

  const handleAcessorioRemovido = (acessorioIndex) => {
    setAcessoriosSelecionados((prevState) => (
      prevState.filter((_, index) => index !== acessorioIndex)));
    handleUpdateFormsAcessorios(acessorioIndex, false);
  };

  const handleCadastrarLocacao = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacao_completa`,
        data: formValues,
        method: 'POST',
      });
      if (response.status === 200 && response.data) {
        limparCampos();
        setMensagemErro('');
        setLocacaoCadastrada(true);
        setFlagSucesso(true);
        setMensagemSucesso(`Locação codigo: ${response.data.codigo} cadastrada com sucesso!`);
      }
    } catch (erro) {
      setMensagemErro(`Erro ao cadastrar locação: ${erro}`);
      setLocacaoCadastrada(false);
      setMensagemSucesso('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(
      (prevValues) => ({
        ...prevValues,
        [name]: value,
      }),
    );
  };

  // Function to handle closing the dialog
  const handleClose = () => {
    setFlagSucesso(false);
  };

  const handleAutocompleteChange = (event, newValue) => {
    // Verifique se newValue não é null ou undefined
    if (newValue) {
      setNomeCliente(newValue);

      // Verifique se selectedClient não é null ou undefined
      const selectedClient = clientes.find((client) => client.nome === newValue.nome);
      if (selectedClient) {
        setFormValues((prevValues) => ({
          ...prevValues,
          cpf: selectedClient.cpf,
          nome_cliente: selectedClient.nome,
        }));
      } else {
      // Se selectedClient for null ou undefined, lide com isso aqui
        setFormValues((prevValues) => ({
          ...prevValues,
          cpf: '',
          nome_cliente: '',
        }));
      }
    } else {
    // Se newValue for null ou undefined, lide com isso aqui
      setNomeCliente('');
      setFormValues((prevValues) => ({
        ...prevValues,
        cpf: '',
        nome_cliente: '',
      }));
    }
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
    buscarTrajes();
    buscarAcessorios();
    buscarClientes();
    buscarUsuarios();
    atualizarValores(); // eslint-disable-next-line
  }, [newAcessoriosSelecionados, newTrajesSelecionados, dep]);

  return (
    <div>
      <form onSubmit={handleCadastrarLocacao}>
        <Container
          style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '33%', marginRight: '10px' }}>
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="h6">Dados da Locação</Typography>
              </Grid>
              <Grid>
                <Autocomplete
                  name="nome_cliente"
                  options={clientes}
                  getOptionLabel={(option) => option.nome}
                  value={nomeCliente}
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => <TextField {...params} label="Nome do Cliente" />}
                  fullWidth
                />
              </Grid>
              <Grid>
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
              <Grid >
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
              <Grid >
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
              <Grid >
                <TextField
                  name="cpf"
                  label="CPF"
                  type="number"
                  value={formValues.cpf}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  disabled
                />
              </Grid>
              <Grid >
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
              <Grid >
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
              <Grid >
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
              <Grid >
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
              <Grid >
                <TextField
                  name="valor_total"
                  label="Valor Total"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                  value={valorTotal}
                  onChange={(e) => {
                    setValorTotal(e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid >
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
              <Grid >
                <TextField
                  name="valor_final"
                  label="Valor Final"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                  value={valorFinal}
                  onChange={(e) => {
                    setValorFinal(e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid >
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
              <Grid >
                <TextField
                  name="valor_restante"
                  label="Valor Restante"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                  value={valorRestante}
                  onChange={(e) => {
                    setValorRestante(e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid >
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
              <Grid >
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
              <Grid >
                <ErrorMessage message={mensagemErro} />
                {locacaoCadastrada ? (
                  <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
                ) : undefined}
              </Grid>
              <Grid >
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </Grid>
            </Grid>
          </div>

          <div style={{ width: '33%', marginRight: '10px' }}>
            <Grid container spacing={2}>
              <Grid >
                <Typography variant="h6">Trajes</Typography>
              </Grid>
              <Grid >
                <FormControl fullWidth>
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
                  }}
                >
                  {trajesSelecionados.map((traje, index) => (
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
                        value={traje.codigo}
                        onChange={(event) => {
                          newTrajesSelecionados = [
                            ...trajesSelecionados,
                          ];
                          const newTraje = {
                            ...traje,
                            codigo: event.target.value,
                          };
                          const indexAtual = newTrajesSelecionados.findIndex(
                            (a) => a.codigo === traje.codigo,
                          );
                          newTrajesSelecionados[indexAtual] = newTraje;
                          setTrajesSelecionados(newTrajesSelecionados);
                          setTrajeSelecionado(newTraje);
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="tamanho_traje"
                        label="Tamanho"
                        disabled={false}
                        value={traje.tamanho}
                        onChange={(event) => {
                          newTrajesSelecionados = [
                            ...trajesSelecionados,
                          ];
                          const newTraje = {
                            ...traje,
                            tamanho: event.target.value,
                          };
                          const indexAtual = newTrajesSelecionados.findIndex(
                            (a) => a.codigo === traje.codigo,
                          );
                          newTrajesSelecionados[indexAtual] = newTraje;
                          setTrajesSelecionados(newTrajesSelecionados);
                          setTrajeSelecionado(newTraje);
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="descricao_traje"
                        label="Descrição"
                        disabled={false}
                        value={traje.descricao}
                        onChange={(event) => {
                          newTrajesSelecionados = [
                            ...trajesSelecionados,
                          ];
                          const newTraje = {
                            ...traje,
                            descricao: event.target.value,
                          };
                          const indexAtual = newTrajesSelecionados.findIndex(
                            (a) => a.codigo === traje.codigo,
                          );
                          newTrajesSelecionados[indexAtual] = newTraje;
                          setTrajesSelecionados(newTrajesSelecionados);
                          setTrajeSelecionado(newTraje);
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="valor_traje"
                        label="Valor"
                        disabled={false}
                        value={traje.valor}
                        onChange={(event) => {
                          newTrajesSelecionados = [
                            ...trajesSelecionados,
                          ];
                          const newTraje = {
                            ...traje,
                            valor: event.target.value,
                          };
                          const indexAtual = newTrajesSelecionados.findIndex(
                            (a) => a.codigo === traje.codigo,
                          );
                          newTrajesSelecionados[indexAtual] = newTraje;
                          setTrajesSelecionados(newTrajesSelecionados);
                          setTrajeSelecionado(newTraje);
                          const newValue = [...formValues.valor_trajes];
                          newValue[indexAtual] = Number(newTraje.valor);
                          setFormValues({
                            ...formValues,
                            valor_trajes: newValue,
                          });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <IconButton onClick={() => handleTrajeRemovido(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>

          <div style={{ width: '33%' }}>
            <Grid container spacing={2}>
              <Grid >
                <Typography variant="h6">Acessórios</Typography>
              </Grid>
              <Grid >
                <FormControl fullWidth>
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
                  {acessoriosSelecionados.map((acessorio, index) => (
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
                        value={acessorio.codigo}
                        onChange={(event) => {
                          newAcessoriosSelecionados = [
                            ...acessoriosSelecionados,
                          ];
                          const newAcessorio = {
                            ...acessorio,
                            codigo: event.target.value,
                          };
                          const indexAtual = newAcessoriosSelecionados.findIndex(
                            (a) => a.codigo === acessorio.codigo,
                          );
                          newAcessoriosSelecionados[indexAtual] = newAcessorio;
                          setAcessoriosSelecionados(newAcessoriosSelecionados);
                          setAcessorioSelecionado(newAcessorio);
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="descricao_acessorio"
                        label="Descrição"
                        disabled={false}
                        value={acessorio.descricao}
                        onChange={(event) => {
                          newAcessoriosSelecionados = [
                            ...acessoriosSelecionados,
                          ];
                          const newAcessorio = {
                            ...acessorio,
                            descricao: event.target.value,
                          };
                          const indexAtual = newAcessoriosSelecionados.findIndex(
                            (a) => a.codigo === acessorio.codigo,
                          );
                          newAcessoriosSelecionados[indexAtual] = newAcessorio;
                          setAcessoriosSelecionados(newAcessoriosSelecionados);
                          setAcessorioSelecionado(newAcessorio);
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="valor_acessorio"
                        label="Valor"
                        disabled={false}
                        value={acessorio.valor}
                        onChange={(event) => {
                          newAcessoriosSelecionados = [
                            ...acessoriosSelecionados,
                          ];
                          const newAcessorio = {
                            ...acessorio,
                            valor: event.target.value,
                          };
                          const indexAtual = newAcessoriosSelecionados.findIndex(
                            (a) => a.codigo === acessorio.codigo,
                          );
                          newAcessoriosSelecionados[indexAtual] = newAcessorio;
                          setAcessoriosSelecionados(newAcessoriosSelecionados);
                          setAcessorioSelecionado(newAcessorio);
                          const newValue = [...formValues.valor_acessorios];
                          newValue[indexAtual] = Number(newAcessorio.valor);
                          setFormValues({
                            ...formValues,
                            valor_acessorios: newValue,
                          });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <IconButton
                        onClick={() => handleAcessorioRemovido(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </form>
    </div>
  );
}

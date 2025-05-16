import React, { useState } from 'react';
import {
  Button, Grid, TextField, Typography, Checkbox,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';


export default function ConsultarCliente() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isAttChecked, setIsAttChecked] = useState(false);
  const [isDelChecked, setIsDelChecked] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [clienteAtualizado, setClienteAtualizado] = useState(null);
  const [clienteDeletado, setClienteDeletado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(null);
  const [cpfCliente, setCpfCliente] = useState('');
  const [formValues, setFormValues] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    telefone2: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const { makeRequest } = useAxiosWithTimeout();

  function resetarCheckbox() {
    setIsAttChecked(false);
    setIsDelChecked(false);
  }

  function limparCampos() {
    setFormValues({
      nome: '',
      cpf: '',
      telefone: '',
      telefone2: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
    setCpfCliente('');
    resetarCheckbox();
  }

  const handleBuscar = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/clientes?cpf=${cpfCliente}`,
        method: 'GET',
      });
      if (response.status === 200 && response.data) {
        setClienteEncontrado(true);
        setClienteAtualizado(null); // reiniciar flag
        setClienteDeletado(null); // reiniciar flag
        resetarCheckbox();
        setFormValues(response.data[0]);
      }
    } catch (erro) {
      setClienteEncontrado(false);
      setMensagemErro(erro);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleAtualizarCliente = async () => {
    setIsLoadingAtt(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/cliente?cpf=${cpfCliente}`,
        data: formValues,
        method: 'PUT',
      });
      if (response.status === 200 && response.data) {
        setClienteEncontrado(true);
        setClienteAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Cliente atualizado com sucesso!');
        resetarCheckbox();
        setFormValues(response.data);
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar cliente: ${erro}`);
      setClienteEncontrado(false);
      setClienteAtualizado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoadingAtt(false);
    }
  };

  const handleDeletarCliente = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/cliente?cpf=${cpfCliente}`,
        method: 'DELETE',
      });
      if (response.status === 200 && response.data) {
        setClienteEncontrado(false); // flag invertida, deletar componentes
        setClienteDeletado(true);
        setMensagemErro(null);
        setFlagSucesso(true);
        setMensagemSucesso('Cliente deletado com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setClienteEncontrado(true); // flag invertida
      setClienteDeletado(false);
      setMensagemSucesso(null);
      setMensagemErro(`Erro ao deletar cliente: ${erro}`);
    } finally {
      setIsLoadingDel(false);
    }
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

  return (
    <div>
      <form onSubmit={handleBuscar}>
        <TextField
          label="CPF do cliente"
          type="tel"
          value={cpfCliente}
          onChange={(e) => setCpfCliente(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" disabled={isLoadingBusca}>
          {isLoadingBusca ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
      {clienteEncontrado === null ? (
        <div></div>
      ) : clienteEncontrado ? (
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Dados do Cliente
            </Typography>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="nome"
                label="Nome"
                value={formValues.nome}
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
                type="number"
                value={formValues.cpf}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="telefone"
                label="Telefone"
                type="tel"
                value={formValues.telefone}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="telefone2"
                label="Telefone 2"
                type="tel"
                value={formValues.telefone2}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
                <TextField
                  name="email"
                  label="Email"
                  value={formValues.email}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="cep"
                label="CEP"
                type="tel"
                value={formValues.cep}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="rua"
                label="Rua"
                value={formValues.rua}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="numero"
                label="Numero"
                type="number"
                value={formValues.numero}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="complemento"
                label="Complemento"
                value={formValues.complemento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="bairro"
                label="Bairro"
                value={formValues.bairro}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="cidade"
                label="Cidade"
                value={formValues.cidade}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="estado"
                label="Estado"
                value={formValues.estado}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Checkbox
                checked={isAttChecked}
                onChange={handleCheckboxAttChange}
              />
              Desejo atualizar o dados do cliente
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleAtualizarCliente}
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
              Desejo deletar o cliente
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleDeletarCliente}
                disabled={!isDelChecked}
                color="error"
              >
                {isLoadingDel ? 'Deletando...' : 'Deletar'}
              </Button>
            </Grid>
            {clienteDeletado === false ? (
              <ErrorMessage message={mensagemErro} />
            ) : null}
          </Grid>
          {clienteAtualizado ? (
            <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
          ) : null}
        </Grid>
      ) : (
        <div>
          <ErrorMessage message={mensagemErro} />
          {clienteDeletado ? (
            <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
          ) : null}
        </div>
      )}
    </div>
  );
}

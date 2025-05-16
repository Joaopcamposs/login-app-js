import React, { useState } from 'react';
import {
  TextField, Button, Grid, Typography, Container,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function CadastrarCliente() {
  const [formValues, setFormValues] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    telefone2: '',
    email: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(false);
  const [clienteCadastrado, setClienteCadastrado] = useState(null);
  const { makeRequest } = useAxiosWithTimeout();

  const limparCampos = () => {
    setFormValues({
      nome: '',
      cpf: '',
      telefone: '',
      telefone2: '',
      email: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  };

  const handleCadastrarCliente = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/cliente`,
        data: formValues,
        method: 'POST',
      });
      if (response.status === 200 && response.data) {
        limparCampos();
        setMensagemErro(null);
        setClienteCadastrado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Cliente cadastrado com sucesso!');
      }
    } catch (erro) {
      setMensagemErro(`Erro ao cadastrar cliente: ${erro}`);
      setClienteCadastrado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarCep = async (value) => {
    try {
      const response = await makeRequest({
        url: `https://viacep.com.br/ws/${value}/json`,
        method: 'GET',
      });
      const dados = await response.data;
      if (response.status === 200 && !dados.erro) {
        setFormValues((prevValues) => ({
          ...prevValues,
          rua: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        }));
        setMensagemErro(null);
      } else {
        setMensagemErro('CEP não encontrado.');
        setFormValues((prevValues) => ({
          ...prevValues,
          rua: '',
          bairro: '',
          cidade: '',
          estado: '',
        }));
      }
    } catch (erro) {
      setMensagemErro(`Erro ao consultar CEP: ${erro}`);
      setFormValues((prevValues) => ({
        ...prevValues,
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
      }));
    }
  };

  function formatarCEP(value) {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não-numéricos
      .replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona a máscara XXXXX-XXX
  }

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

  const handleChangeCEP = (event) => {
    const value = formatarCEP(event.target.value);
    setFormValues((prevValues) => ({
      ...prevValues,
      cep: value,
    }));
    if (value.length === 9) {
      buscarCep(value);
    }
  };

  return (
    <div>
      <form onSubmit={handleCadastrarCliente}>
        <Container
          maxWidth="md"
          style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Dados do Cliente</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="nome"
                  label="Nome Completo"
                  value={formValues.nome}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  value={formValues.email}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cep"
                  label="CEP"
                  type="tel"
                  value={formValues.cep}
                  onChange={handleChangeCEP}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  name="complemento"
                  label="Complemento"
                  value={formValues.complemento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <ErrorMessage message={mensagemErro} />
                {clienteCadastrado ? (
                  <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
                ) : null}
              </Grid>
              <Grid item xs={4}>
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import {
  TextField, Button, Grid, Typography, Container,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function CadastrarAcessorio() {
  const [formValues, setFormValues] = useState({
    codigo: '',
    descricao: '',
    valor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(false);
  const [acessorioCadastrado, setAcessorioCadastrado] = useState(null);
  const { makeRequest } = useAxiosWithTimeout();

  const limparCampos = () => {
    setFormValues({
      codigo: '',
      descricao: '',
      valor: '',
    });
  };

  const handleCadastrarAcessorio = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorio`,
        data: formValues,
        method: 'POST',
      });
      if (response.status === 200 && response.data) {
        limparCampos();
        setMensagemErro(null);
        setAcessorioCadastrado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Acessório cadastrado com sucesso!');
      }
    } catch (erro) {
      setMensagemErro(`Erro ao cadastrar acessório: ${erro}`);
      setAcessorioCadastrado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoading(false);
    }
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
      <form onSubmit={handleCadastrarAcessorio}>
        <Container
          maxWidth="md"
          style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Dados do Acessório</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="codigo"
                  label="Código"
                  value={formValues.codigo}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descricao"
                  label="Descrição"
                  value={formValues.descricao}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="valor"
                  label="Valor"
                  type="number"
                  value={formValues.valor}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <ErrorMessage message={mensagemErro} />
                {acessorioCadastrado ? (
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

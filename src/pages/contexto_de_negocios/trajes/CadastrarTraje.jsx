import React, { useState } from 'react';
import {
  TextField, Button, Grid, Typography, Container,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function CadastrarTraje() {
  const [formValues, setFormValues] = useState({
    codigo: '',
    descricao: '',
    tamanho: '',
    valor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(null);
  const [trajeCadastrado, setTrajeCadastrado] = useState(null);
  const { makeRequest } = useAxiosWithTimeout();

  const limparCampos = () => {
    setFormValues({
      codigo: '',
      descricao: '',
      tamanho: '',
      valor: '',
    });
  };

  const handleCadastrarTraje = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/traje`,
        data: formValues,
        method: 'POST',
      });

      if (response.status === 200 && response.data) {
        limparCampos();
        setMensagemErro(null);
        setTrajeCadastrado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Traje cadastrado com sucesso!');
      }
    } catch (erro) {
      setMensagemErro(`Erro ao cadastrar traje: ${erro}`);
      setTrajeCadastrado(false);
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
      <form onSubmit={handleCadastrarTraje}>
        <Container
          maxWidth="md"
          style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Dados do Traje</Typography>
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
                  name="tamanho"
                  label="Tamanho"
                  value={formValues.tamanho}
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
                {trajeCadastrado ? (
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

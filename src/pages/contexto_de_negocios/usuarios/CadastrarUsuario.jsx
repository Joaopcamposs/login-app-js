import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function CadastrarUsuario() {
  const [formValues, setFormValues] = useState({
    nome: '',
    email: '',
    senha: '',
    adm: false,
    ativo: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(null);
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(null);
  const { makeRequest } = useAxiosWithTimeout();

  const limparCampos = () => {
    setFormValues({
      nome: '',
      email: '',
      senha: '',
      adm: false,
      ativo: true,
    });
  };

  const handleCadastrarUsuario = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/usuario`,
        data: formValues,
        method: 'POST',
      });
      if (response.status === 200 && response.data) {
        limparCampos();
        setMensagemErro(null);
        setUsuarioCadastrado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Usuário cadastrado com sucesso!');
      }
    } catch (erro) {
      setMensagemErro(`Erro ao cadastrar usuario: ${erro}`);
      setUsuarioCadastrado(false);
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
      <form onSubmit={handleCadastrarUsuario}>
        <Container
          maxWidth="md"
          style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Dados do Usuario</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="nome"
                  label="Nome"
                  value={formValues.nome}
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  autoComplete="new-email"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="senha"
                  label="Senha"
                  type="password"
                  value={formValues.senha}
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  autoComplete="new-password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl width="100px">
                  <InputLabel id="adm-select-label">ADM</InputLabel>
                  <Select
                    MenuProps={{ style: { maxHeight: 300 } }}
                    name="adm"
                    labelId="adm-select-label"
                    id="adm-select"
                    value={formValues.adm}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    label="ADM"
                    required
                    style={{ width: '100px' }}
                  >
                    <MenuItem value={false}>Não</MenuItem>
                    <MenuItem value={true}>Sim</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl width="100px">
                  <InputLabel id="ativo-select-label">Ativo</InputLabel>
                  <Select
                    MenuProps={{ style: { maxHeight: 300 } }}
                    name="ativo"
                    labelId="ativo-select-label"
                    id="ativo-select"
                    value={formValues.ativo}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    label="Ativo"
                    required
                    style={{ width: '100px' }}
                  >
                    <MenuItem value={false}>Não</MenuItem>
                    <MenuItem value={true}>Sim</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <ErrorMessage message={mensagemErro} />
                {usuarioCadastrado ? (
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

import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function ConsultarUsuario() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isAttChecked, setIsAttChecked] = useState(false);
  const [isDelChecked, setIsDelChecked] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [usuarioAtualizado, setUsuarioAtualizado] = useState(null);
  const [usuarioDeletado, setUsuarioDeletado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(null);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [formValues, setFormValues] = useState({
    nome: '',
    email: '',
    adm: '',
    ativo: '',
  });
  const { makeRequest } = useAxiosWithTimeout();

  function resetarCheckbox() {
    setIsAttChecked(false);
    setIsDelChecked(false);
  }

  function limparCampos() {
    setFormValues({
      nome: '',
      email: '',
      adm: '',
      ativo: '',
    });
    setEmailUsuario('');
    resetarCheckbox();
  }

  const handleBuscar = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/usuarios?email=${emailUsuario}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setUsuarioEncontrado(true);
        setUsuarioAtualizado(false); // reiniciar flag
        setUsuarioDeletado(false); // reiniciar flag
        resetarCheckbox();
        setFormValues(response.data[0]);
      } else {
        setUsuarioEncontrado(false);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setUsuarioEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleAtualizarUsuario = async () => {
    setIsLoadingAtt(true);

    const formValuesAtt = {
      ...formValues,
      senha,
    };

    try {
      const response = await makeRequest({
        url: '/test',
        // url: `${API_V1_PREFIX}/usuario?email=${emailUsuario}`,
        data: formValuesAtt,
        method: 'PUT',
      });

      if (response.status === 200 && response.data) {
        setUsuarioEncontrado(true);
        setUsuarioAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Usuario atualizado com sucesso!');
        resetarCheckbox();
        setSenha('');
        setFormValues(response.data);
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar usuario: ${erro}`);
      setUsuarioEncontrado(false);
      setUsuarioAtualizado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoadingAtt(false);
    }
  };

  const handleDeletarUsuario = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/usuario?email=${emailUsuario}`,
        method: 'DELETE',
      });
      if (response.status === 200 && response.data) {
        setUsuarioEncontrado(false); // flag invertida, deletar componentes
        setUsuarioDeletado(true);
        setMensagemErro(null);
        setFlagSucesso(true);
        setMensagemSucesso('Usuario deletado com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setMensagemErro(`Erro ao deletar usuario: ${erro}`);
      setUsuarioEncontrado(true); // flag invertida
      setUsuarioDeletado(false);
      setMensagemSucesso(null);
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
    <div style={{ marginTop: '30px' }}>
      <form onSubmit={handleBuscar}>
        <TextField
          label="Email do usuario"
          type="email"
          value={emailUsuario}
          onChange={(e) => setEmailUsuario(e.target.value)}
          inputlabelprops={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" disabled={isLoadingBusca}>
          {isLoadingBusca ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
      {usuarioEncontrado === null ? (
        <div></div>
      ) : usuarioEncontrado ? (
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Dados do Usuario
            </Typography>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="nome"
                label="Nome"
                value={formValues.nome}
                onChange={handleChange}
                inputlabelprops={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                inputlabelprops={{ shrink: true }}
                fullWidth
                autoComplete="new-email"
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <TextField
                name="senha"
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                inputlabelprops={{ shrink: true }}
                fullWidth
                autoComplete="new-password"
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <FormControl fullWidth>
                <InputLabel id="adm-select-label">ADM</InputLabel>
                <Select
                  MenuProps={{ style: { maxHeight: 300 } }}
                  name="adm"
                  labelId="adm-select-label"
                  id="adm-select"
                  value={formValues.adm}
                  onChange={handleChange}
                  inputlabelprops={{ shrink: true }}
                  label="ADM"
                  required
                >
                  <MenuItem value={false}>Não</MenuItem>
                  <MenuItem value={true}>Sim</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <FormControl fullWidth>
                <InputLabel id="ativo-select-label">Ativo</InputLabel>
                <Select
                  MenuProps={{ style: { maxHeight: 300 } }}
                  name="ativo"
                  labelId="ativo-select-label"
                  id="ativo-select"
                  value={formValues.ativo}
                  onChange={handleChange}
                  inputlabelprops={{ shrink: true }}
                  label="Ativo"
                  required
                >
                  <MenuItem value={false}>Não</MenuItem>
                  <MenuItem value={true}>Sim</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Checkbox
                checked={isAttChecked}
                onChange={handleCheckboxAttChange}
              />
              Desejo atualizar os dados do usuario
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleAtualizarUsuario}
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
              Desejo deletar o usuario
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleDeletarUsuario}
                disabled={!isDelChecked}
                color="error"
              >
                {isLoadingDel ? 'Deletando...' : 'Deletar'}
              </Button>
            </Grid>
          </Grid>
          {usuarioAtualizado ? (
            <SuccessMessage
              open={flagSucesso}
              message={mensagemSucesso}
              onClose={handleClose} />
          ) : null}
        </Grid>
      ) : (
        <div>
          <ErrorMessage message={mensagemErro} />
          {usuarioDeletado ? (
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

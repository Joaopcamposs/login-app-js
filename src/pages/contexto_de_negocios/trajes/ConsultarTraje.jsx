import React, { useState } from 'react';
import {
  Button, Grid, TextField, Typography, Checkbox,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function ConsultarTraje() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isAttChecked, setIsAttChecked] = useState(false);
  const [isDelChecked, setIsDelChecked] = useState(false);
  const [trajeEncontrado, setTrajeEncontrado] = useState(null);
  const [trajeAtualizado, setTrajeAtualizado] = useState(null);
  const [trajeDeletado, setTrajeDeletado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(null);
  const [codigoTraje, setCodigoTraje] = useState('');
  const [formValues, setFormValues] = useState({
    codigo: '',
    descricao: '',
    tamanho: '',
    valor: '',
  });
  const { makeRequest } = useAxiosWithTimeout();

  function resetarCheckbox() {
    setIsAttChecked(false);
    setIsDelChecked(false);
  }

  function limparCampos() {
    setFormValues({
      codigo: '',
      descricao: '',
      tamanho: '',
      valor: '',
    });
    setCodigoTraje('');
    resetarCheckbox();
  }

  const handleBuscar = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/trajes?codigo=${codigoTraje}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setTrajeEncontrado(true);
        setTrajeAtualizado(null); // reiniciar flag
        setTrajeDeletado(null); // reiniciar flag
        resetarCheckbox();
        setFormValues(response.data[0]);
      }
    } catch (erro) {
      setTrajeEncontrado(false);
      setMensagemErro(erro);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleAtualizarTraje = async () => {
    setIsLoadingAtt(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/traje?codigo=${codigoTraje}`,
        data: formValues,
        method: 'PUT',
      });

      if (response.status === 200 && response.data) {
        setTrajeEncontrado(true);
        setTrajeAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Traje atualizado com sucesso!');
        resetarCheckbox();
        setFormValues(response.data);
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar traje: ${erro}`);
      setTrajeEncontrado(false);
      setTrajeAtualizado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoadingAtt(false);
    }
  };

  const handleDeletarTraje = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/traje?codigo=${codigoTraje}`,
        method: 'DELETE',
      });
      if (response.status === 200 && response.data) {
        setTrajeEncontrado(false); // flag invertida, deletar componentes
        setTrajeDeletado(true);
        setMensagemErro(null);
        setFlagSucesso(true);
        setMensagemSucesso('Traje deletado com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setTrajeEncontrado(true); // flag invertida
      setTrajeDeletado(false);
      setMensagemSucesso(null);
      setMensagemErro(`Erro ao deletar traje: ${erro}`);
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
          label="Código do traje"
          type="number"
          value={codigoTraje}
          onChange={(e) => setCodigoTraje(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" disabled={isLoadingBusca}>
          {isLoadingBusca ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
      {trajeEncontrado === null ? (
        <div></div>
      ) : trajeEncontrado ? (
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Dados do Traje
            </Typography>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
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
            <Grid item xs={12} style={{ marginTop: '16px' }}>
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
            <Grid item xs={12} style={{ marginTop: '16px' }}>
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
            <Grid item xs={12} style={{ marginTop: '16px' }}>
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
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Checkbox
                checked={isAttChecked}
                onChange={handleCheckboxAttChange}
              />
              Desejo atualizar os dados do traje
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleAtualizarTraje}
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
              Desejo deletar o traje
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleDeletarTraje}
                disabled={!isDelChecked}
                color="error"
              >
                {isLoadingDel ? 'Deletando...' : 'Deletar'}
              </Button>
            </Grid>
            {trajeDeletado === false ? (
              <ErrorMessage message={mensagemErro} />
            ) : null}
          </Grid>
          {trajeAtualizado ? (
            <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
          ) : null}
        </Grid>
      ) : (
        <div>
          <ErrorMessage message={mensagemErro} />
          {trajeDeletado ? (
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

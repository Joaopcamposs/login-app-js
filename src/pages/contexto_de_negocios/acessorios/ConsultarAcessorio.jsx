import React, { useState } from 'react';
import {
  Button, Grid, TextField, Typography, Checkbox,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function ConsultarAcessorio() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isAttChecked, setIsAttChecked] = useState(false);
  const [isDelChecked, setIsDelChecked] = useState(false);
  const [acessorioEncontrado, setAcessorioEncontrado] = useState(null);
  const [acessorioAtualizado, setAcessorioAtualizado] = useState(null);
  const [acessorioDeletado, setAcessorioDeletado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [flagSucesso, setFlagSucesso] = useState(false);
  const [codigoAcessorio, setCodigoAcessorio] = useState('');
  const [formValues, setFormValues] = useState({
    codigo: '',
    descricao: '',
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
      valor: '',
    });
    setCodigoAcessorio('');
    resetarCheckbox();
  }

  const handleBuscarAcessorio = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorios?codigo=${codigoAcessorio}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setAcessorioEncontrado(true);
        setAcessorioAtualizado(null); // reiniciar flag
        setAcessorioDeletado(null); // reiniciar flag
        resetarCheckbox();
        setFormValues(response.data[0]);
      }
    } catch (erro) {
      setAcessorioEncontrado(false);
      setMensagemErro(erro);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleAtualizarAcessorio = async () => {
    setIsLoadingAtt(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorio?codigo=${codigoAcessorio}`,
        data: formValues,
        method: 'PUT',
      });

      if (response.status === 200 && response.data) {
        setAcessorioEncontrado(true);
        setAcessorioAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Acessório atualizado com sucesso!');
        resetarCheckbox();
        setFormValues(response.data);
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar acessorio: ${erro}`);
      setAcessorioEncontrado(false);
      setAcessorioAtualizado(false);
      setMensagemSucesso(null);
    } finally {
      setIsLoadingAtt(false);
    }
  };

  const handleDeletarAcessorio = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorio?codigo=${codigoAcessorio}`,
        method: 'DELETE',
      });
      if (response.status === 200 && response.data) {
        setAcessorioEncontrado(false); // flag invertida, deletar componentes
        setAcessorioDeletado(true);
        setMensagemErro(null);
        setFlagSucesso(true);
        setMensagemSucesso('Acessório deletado com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setAcessorioEncontrado(true); // flag invertida
      setAcessorioDeletado(false);
      setMensagemSucesso(null);
      setMensagemErro(`Erro ao deletar acessorio: ${erro}`);
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
      <form onSubmit={handleBuscarAcessorio}>
        <TextField
          label="Código do acessório"
          type="number"
          value={codigoAcessorio}
          onChange={(e) => setCodigoAcessorio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" disabled={isLoadingBusca}>
          {isLoadingBusca ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
      {acessorioEncontrado === null ? (
        <div></div>
      ) : acessorioEncontrado ? (
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Dados do Acessório
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
              <Typography>
                <Checkbox
                  checked={isAttChecked}
                  onChange={handleCheckboxAttChange}
                />
                Desejo atualizar so dados do acessório
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleAtualizarAcessorio}
                disabled={!isAttChecked}
                color="warning"
              >
                {isLoadingAtt ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Typography>
                <Checkbox
                  checked={isDelChecked}
                  onChange={handleCheckboxDelChange}
                />
                Desejo deletar o acessório
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Button
                variant="contained"
                onClick={handleDeletarAcessorio}
                disabled={!isDelChecked}
                color="error"
              >
                {isLoadingDel ? 'Deletando...' : 'Deletar'}
              </Button>
            </Grid>
            {acessorioDeletado === false ? (
              <ErrorMessage message={mensagemErro} />
            ) : null}
          </Grid>
          {acessorioAtualizado ? (
            <SuccessMessage
                    open={flagSucesso}
                    message={mensagemSucesso}
                    onClose={handleClose} />
          ) : null}
        </Grid>
      ) : (
        <div>
          <ErrorMessage message={mensagemErro} />
          {acessorioDeletado ? (
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

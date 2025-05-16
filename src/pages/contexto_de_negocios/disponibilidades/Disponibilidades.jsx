import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';


export default function Disponibilidades() {
  const [trajeDataEvento, setTrajeDataEvento] = useState('');
  const [acessorioDataEvento, setAcessorioDataEvento] = useState('');
  const [trajesOcupadosData, setTrajesOcupadosData] = useState([]);
  const [acessoriosOcupadosData, setAcessoriosOcupadosData] = useState([]);
  const [trajesEncontrados, setTrajesEncontrados] = useState(null);
  const [acessoriosEncontrados, setAcessoriosEncontrados] = useState(null);
  const [isLoadingBusca, setIsLoadingBusca] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const { makeRequest } = useAxiosWithTimeout();

  const handleBuscarTrajesOcupados = async (e) => {
    setIsLoadingBusca(true);
    e.preventDefault();

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/trajes/disponibilidade?status=ocupado&data_evento=${trajeDataEvento}`,
        method: 'GET',
      });
      if (response.status === 200 && response.data && response.data.length > 0) {
        setTrajesEncontrados(true);
        setTrajesOcupadosData(response.data);
        setMensagemErro(null);
      } else if (response.data.length === 0) {
        setTrajesEncontrados(false);
        setMensagemErro('Nenhum traje ocupado nesta data.');
      }
    } catch (erro) {
      setMensagemErro(erro);
      setTrajesEncontrados(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };

  const handleBuscarAcessoriosOcupados = async (e) => {
    e.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorios/disponibilidade?status=ocupado&data_evento=${trajeDataEvento}`,
        method: 'GET',
      });
      if (response.status === 200 && response.data && response.data.length > 0) {
        setAcessoriosEncontrados(true);
        setAcessoriosOcupadosData(response.data);
        setMensagemErro(null);
      } else if (response.data.length === 0) {
        setAcessoriosEncontrados(false);
        setMensagemErro('Nenhum acessorio ocupado nesta data.');
      }
    } catch (error) {
      setMensagemErro(error.response.data.detail);
      setAcessoriosEncontrados(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };


  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Disponibilidade de Trajes e Acessórios</h1>
      <Grid container spacing={2}>
  
      <Grid item xs={12} >
        <div>
          <form onSubmit={handleBuscarTrajesOcupados}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginTop: '16px' }}>
                  Trajes Ocupados
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                <TextField
                  label="Data Evento"
                  type="date"
                  value={trajeDataEvento}
                  onChange={(e) => setTrajeDataEvento(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingBusca}
                >
                  {isLoadingBusca ? 'Buscando...' : 'Buscar'}
                </Button>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                {trajesEncontrados ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell>Tamanho</TableCell>
                          <TableCell>Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trajesOcupadosData.map((traje) => (
                          <TableRow key={traje.id}>
                            <TableCell>{traje.codigo}</TableCell>
                            <TableCell>{traje.descricao}</TableCell>
                            <TableCell>{traje.tamanho}</TableCell>
                            <TableCell>{traje.valor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <ErrorMessage message={mensagemErro} />
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <div>
          <form onSubmit={handleBuscarAcessoriosOcupados}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginTop: '16px' }}>
                  Acessórios Ocupados
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                <TextField
                  label="Data Evento"
                  type="date"
                  value={acessorioDataEvento}
                  onChange={(e) => setAcessorioDataEvento(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingBusca}
                >
                  {isLoadingBusca ? 'Buscando...' : 'Buscar'}
                </Button>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                {acessoriosEncontrados ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell>Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {acessoriosOcupadosData.map((acessorio) => (
                          <TableRow key={acessorio.id}>
                            <TableCell>{acessorio.codigo}</TableCell>
                            <TableCell>{acessorio.descricao}</TableCell>
                            <TableCell>{acessorio.valor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <ErrorMessage message={mensagemErro} />
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <div>
          <form onSubmit={() => {} /* todo implementar aqui */ }>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginTop: '16px' }}>
                  Trajes Livres
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                <TextField
                  label="Data Evento"
                  type="date"
                  value={trajeDataEvento}
                  onChange={(e) => setTrajeDataEvento(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingBusca}
                >
                  {isLoadingBusca ? 'Buscando...' : 'Buscar'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <div>
          <form onSubmit={() => {} /* todo implementar aqui */ }>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginTop: '16px' }}>
                  Acessórios Livres
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
                <TextField
                  label="Data Evento"
                  type="date"
                  value={acessorioDataEvento}
                  onChange={(e) => setAcessorioDataEvento(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoadingBusca}
                >
                  {isLoadingBusca ? 'Buscando...' : 'Buscar'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
    </div>
  );
}

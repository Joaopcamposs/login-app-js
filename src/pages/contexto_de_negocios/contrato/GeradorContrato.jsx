import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Autocomplete } from '@mui/material';
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import { API_V1_PREFIX } from '../../../App';
import ErrorMessage from '../../../components/ErrorMessage';


export default function GeradorContrato() {
  const [codigo, setCodigo] = useState('');
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfGerado, setPdfGerado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [clientes, setClientes] = useState([{ nome: '' }]);
  const [nomeCliente, setNomeCliente] = useState(clientes[0]);
  const { makeRequest } = useAxiosWithTimeout();

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

  const handleGerarPdfCodigo = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/gerar_pdf_contrato?codigo=${codigo}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setPdfGerado(true);

        const contentDisposition = response.headers.get('content-disposition');
        const nomeArquivo = contentDisposition
          .split('=')[1]
          .substring(0, contentDisposition.split('=')[1].length);
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = nomeArquivo;
        link.click();
      }
    } catch (erro) {
      setMensagemErro(`Erro ao gerar PDF: ${erro}`);
      setPdfGerado(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGerarPdfCpf = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/gerar_pdf_contrato?ultima_no_cpf=${cpf}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setPdfGerado(true);

        const contentDisposition = response.headers.get('content-disposition');
        const nomeArquivo = contentDisposition
          .split('=')[1]
          .substring(0, contentDisposition.split('=')[1].length);
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = nomeArquivo;
        link.click();
      }
    } catch (erro) {
      setMensagemErro(`Erro ao gerar PDF: ${erro}`);
      setPdfGerado(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    setNomeCliente(newValue);
    const selectedClient = clientes.find((client) => client.nome === newValue.nome);
    setCpf(selectedClient.cpf);
  };

  useEffect(() => { buscarClientes(); }, [buscarClientes]);


  return (
    <div>
      <h1 style={{ color: 'var(--color-blanca-escuro)' , fontWeight: 'bold'}}>Gestão de Contratos</h1>
      <form onSubmit={handleGerarPdfCodigo} style={{ marginBottom: '25px' }}>
        <TextField
          label="Código do contrato"
          type="number"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          autoFocus
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Gerar PDF'}
        </Button>
      </form>
      <form onSubmit={handleGerarPdfCpf} style={{ marginBottom: '16px' }}>
        <TextField
          label="CPF do Cliente"
          type="tel"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          InputLabelProps={{ shrink: true }}
          autoFocus
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Gerar PDF'}
        </Button>
      </form>
      <form style={{ marginBottom: '16px' }}>
        <Autocomplete
          options={clientes}
          getOptionLabel={(option) => option.nome}
          value={nomeCliente}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Nome do Cliente" />}
          required
          style={{ width: 340 }}
        />
      </form>
      {pdfGerado === null || pdfGerado === true ? (
        <div></div>
      ) : (
        <div>
          <ErrorMessage message={mensagemErro} />
        </div>
      )}

    </div>
  );
}

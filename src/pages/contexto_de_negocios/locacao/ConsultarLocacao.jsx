import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Divider,
  Card,
  CardBody,
  Heading,
  Flex,
  Spinner,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'
import TextField from '@mui/material/TextField'
import moment from 'moment/moment'
import { API_V1_PREFIX } from '../../../App'
import useAxiosWithTimeout from '../../../services/AxiosWithTimeout'
import FloatingInput from '../../../components/FloatingInput'

export default function ConsultarLocacao() {
  const [isLoadingBusca, setIsLoadingBusca] = useState(false)
  const [isLoadingAtt, setIsLoadingAtt] = useState(false)
  const [isLoadingDel, setIsLoadingDel] = useState(false)
  const [locacaoEncontrado, setLocacaoEncontrado] = useState(undefined)
  const [locacaoAtualizado, setLocacaoAtualizado] = useState(undefined)
  const [locacaoDeletado, setLocacaoDeletado] = useState(undefined)
  const [mensagemErro, setMensagemErro] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [codigoLocacao, setCodigoLocacao] = useState('')
  const [cpfCliente, setCpf] = useState('')
  const [clientes, setClientes] = useState([{ nome: '' }])
  const [usuarios, setUsuarios] = useState([])
  const [trajes, setTrajes] = useState([])
  const [acessorios, setAcessorios] = useState([])
  const [nomeCliente, setNomeCliente] = useState(undefined)

  const { makeRequest } = useAxiosWithTimeout();
  const toast = useToast()

  function limparCampos() {
    setCodigoLocacao('');
  }

  async function preencherForms(locacao) {
    setFormValues({
      nome_cliente: locacao.nome_cliente || '',
      nome_dama: locacao.nome_dama || '',
      nome_noiva: locacao.nome_noiva || '',
      idade: locacao.idade || '',
      cpf: locacao.cpf || '',
      data_venda: locacao.data_venda || undefined,
      data_evento: locacao.data_evento || undefined,
      data_retirada: locacao.data_retirada || undefined,
      data_devolucao: locacao.data_devolucao || undefined,
      valor_total: locacao.valor_total || '',
      valor_desconto: locacao.valor_desconto || 0,
      valor_final: locacao.valor_final || '',
      valor_entrada: locacao.valor_entrada || 0,
      valor_restante: locacao.valor_restante || '',
      observacoes: locacao.observacoes || '',
      vendedor: locacao.vendedor || '',

      codigo_trajes: locacao.trajes_locados?.map((traje) => traje.codigo_traje) || [],
      descricao_trajes: locacao.trajes_locados?.map((traje) => traje.descricao) || [],
      tamanho_trajes: locacao.trajes_locados?.map((traje) => traje.tamanho) || [],
      valor_trajes: locacao.trajes_locados?.map((traje) => traje.valor) || [],

      codigo_acessorios: locacao.acessorios_locados?.map(
        (acessorio) => acessorio.codigo_acessorio
      ) || [],
      descricao_acessorios: locacao.acessorios_locados?.map((acessorio) => acessorio.descricao) || [],
      valor_acessorios: locacao.acessorios_locados?.map((acessorio) => acessorio.valor) || [],
    });
  }

  // Form values state
  const [formValues, setFormValues] = useState({
    nome_cliente: '',
    nome_dama: '',
    nome_noiva: '',
    idade: '',
    cpf: '',
    data_venda: undefined,
    data_evento: undefined,
    data_retirada: undefined,
    data_devolucao: undefined,
    valor_total: '',
    valor_desconto: 0,
    valor_final: '',
    valor_entrada: 0,
    valor_restante: '',
    observacoes: '',
    vendedor: '',
    codigo_trajes: [],
    descricao_trajes: [],
    tamanho_trajes: [],
    valor_trajes: [],
    codigo_acessorios: [],
    descricao_acessorios: [],
    valor_acessorios: [],
  })

  // Handlers
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
  const buscarUsuarios = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/usuarios`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const usuariosOrdenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        // ordena o array pelo nome ordem crescente
        setUsuarios(usuariosOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const buscarTrajes = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/trajes`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const trajesOrdenados = response.data.sort((a, b) => a.codigo - b.codigo);
        // ordena o array pelo código em ordem crescente
        setTrajes(trajesOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const buscarAcessorios = async () => {
    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/acessorios`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        const acessoriosOrdenados = response.data.sort((a, b) => a.codigo - b.codigo);
        // ordena o array pelo código em ordem crescente
        setAcessorios(acessoriosOrdenados);
      }
    } catch (erro) {
      setMensagemErro(erro);
    }
  };
  const handleBuscarPorCodigo = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?codigo=${codigoLocacao}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        await preencherForms(response.data[0]);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };
  const handleBuscarPorCPF = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?ultima_no_cpf=${cpfCliente}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        await preencherForms(response.data[0]);
        setCodigoLocacao(response.data[0].codigo);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };
  const handleBuscarTodasPorCPF = async (event) => {
    event.preventDefault();
    setIsLoadingBusca(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacoes_completas?todas_no_cpf=${cpfCliente}`,
        method: 'GET',
      });

      if (response.status === 200 && response.data && response.data.length > 0) {
        setLocacaoEncontrado(false);
        setLocacaoAtualizado(false); // reiniciar flag
        setLocacaoDeletado(false); // reiniciar flag
        let codigosLocados = '';
        response.data.forEach((locacao) => {
          codigosLocados += `${locacao.codigo}, `;
        });
        // Remover a vírgula extra no final da string
        codigosLocados = codigosLocados.slice(0, -2);
        const mensagem = `Codigos de locações para ${response.data[0].nome_cliente} no cpf ${cpfCliente}: ${codigosLocados}`;
        setMensagemErro(mensagem);
      } else if (response.status === 200 && response.data) {
        const mensagem = `Nenhuma locação encontrada para o CPF ${cpfCliente}!`;
        setMensagemErro(mensagem);
        setLocacaoEncontrado(false);
      }
    } catch (erro) {
      setMensagemErro(erro);
      setLocacaoEncontrado(false);
    } finally {
      setIsLoadingBusca(false);
    }
  };
  const handleAtualizarLocacao = async () => {
    setIsLoadingAtt(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacao_completa?codigo=${codigoLocacao}`,
        data: formValues,
        method: 'PUT',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(true);
        setLocacaoAtualizado(true);
        setFlagSucesso(true);
        setMensagemSucesso('Locação atualizada com sucesso!');
        await preencherForms(
          response.data,
        );
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar locação: ${erro}`);
      setLocacaoEncontrado(false);
      setLocacaoAtualizado(false);
      setMensagemSucesso('');
    } finally {
      setIsLoadingAtt(false);
    }
  };
  const handleDeletarLocacao = async () => {
    setIsLoadingDel(true);

    try {
      const response = await makeRequest({
        url: `${API_V1_PREFIX}/locacao_completa?codigo=${codigoLocacao}`,
        method: 'DELETE',
      });

      if (response.status === 200 && response.data) {
        setLocacaoEncontrado(false); // flag invertida, deletar componentes
        setLocacaoDeletado(true);
        setMensagemErro('');
        setFlagSucesso(true);
        setMensagemSucesso('Locacao deletada com sucesso!');
        limparCampos();
      }
    } catch (erro) {
      setMensagemErro(`Erro ao atualizar locação: ${erro}`);
      setLocacaoEncontrado(true); // flag invertida
      setLocacaoDeletado(false);
      setMensagemSucesso('');
    }

    setIsLoadingDel(false);
  };


  const handleAutocompleteChange = (event, newValue) => {
    setNomeCliente(newValue);
    const selectedClient = clientes.find((client) => client.nome === newValue.nome);
    setCpf(selectedClient.cpf);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Componente de busca
  const BuscaForm = () => (
    <Box w="100%" maxW="220px" marginLeft='-10px'>
      <VStack spacing={6} align="stretch" mb={8}>
        {/* Buscar por Código */}
        <form onSubmit={handleBuscarPorCodigo}>
          <VStack spacing={2} align="stretch">
            <FormControl isRequired>
              <FormLabel>Código da Locação</FormLabel>
              <NumberInput>
                <NumberInputField
                  value={codigoLocacao}
                  onChange={(e) => setCodigoLocacao(e.target.value)}
                />
              </NumberInput>
            </FormControl>
            <Button
              type="submit"
              colorScheme="blanca_escuro"
              isLoading={isLoadingBusca}
              loadingText="Buscando..."
              width="100%"
            >
              Buscar por Código
            </Button>
          </VStack>
        </form>
  
        {/* Buscar por CPF */}
        <form onSubmit={handleBuscarPorCPF}>
          <VStack spacing={2} align="stretch">
            <FormControl isRequired>
              <FormLabel>CPF do Cliente</FormLabel>
              <Input
                type="tel"
                value={cpfCliente}
                onChange={(e) => setCpf(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blanca_escuro"
              isLoading={isLoadingBusca}
              loadingText="Buscando..."
              width="100%"
            >
              Buscar por CPF
            </Button>
          </VStack>
        </form>
  
        {/* Buscar múltiplas locações por CPF */}
        <form onSubmit={handleBuscarTodasPorCPF}>
          <VStack spacing={2} align="stretch">
            <FormControl isRequired>
              <FormLabel>Nome do Cliente</FormLabel>
              <Select
                placeholder="Selecione"
                value={nomeCliente}
                onChange={handleAutocompleteChange}
              >
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.nome}>
                    {cliente.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
  
            <FormControl isRequired>
              <FormLabel>CPF do Cliente</FormLabel>
              <Input
                type="tel"
                value={cpfCliente}
                onChange={(e) => setCpf(e.target.value)}
              />
            </FormControl>
  
            <Button
              type="submit"
              colorScheme="blanca_escuro"
              isLoading={isLoadingBusca}
              loadingText="Buscando..."
              width="100%"
            >
              Lista Códigos por CPF
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );

  // Componente de formulário principal
  const FormularioPrincipal = () => (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem>
        <Card>
          <CardBody>
            <VStack spacing={2} align="stretch">
              <Heading size="md" margin='auto' align='center'>Locação</Heading>
              
              <FloatingInput
                label="Nome do Cliente"
                name="nome_cliente"
                value={formValues.nome_cliente}
                onChange={handleChange}
                isRequired
              />
              <FloatingInput
                label="Nome da Dama"
                name="nome_dama"
                value={formValues.nome_dama}
                onChange={handleChange}
                isRequired
              />
              <FloatingInput
                label="Nome da Noiva"
                name="nome_noiva"
                value={formValues.nome_noiva}
                onChange={handleChange}
                isRequired
              />
              
              <Grid templateColumns="repeat(1, 1fr)" gap={4}>
                <FloatingInput
                  label="Idade"
                  name="idade"
                  type="number"
                  value={formValues.idade}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="CPF"
                  name="cpf"
                  type="tel"
                  value={formValues.cpf}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="Data da Venda"
                  name="data_venda"
                  type="date"
                  value={formValues.data_venda}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="Data do Evento"
                  name="data_evento"
                  type="date"
                  value={formValues.data_evento}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="Data da Retirada"
                  name="data_retirada"
                  type="date"
                  value={formValues.data_retirada}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="Data da Devolução"
                  name="data_devolucao"
                  type="date"
                  value={formValues.data_devolucao}
                  onChange={handleChange}
                  isRequired
                />

                <FloatingInput
                  label="Valor Total"
                  name="valor_total"
                  type="number"
                  value={formValues.valor_total}
                  onChange={(event) => {
                    handleChange(event);
                    setDep((prevDep) => !prevDep);
                  }}
                  isDisabled
                  leftElement="R$"
                />

                <FloatingInput
                  label="Valor do Desconto"
                  name="valor_desconto"
                  type="number"
                  value={formValues.valor_desconto}
                  onChange={(event) => {
                    handleChange(event);
                    setDep((prevDep) => !prevDep);
                  }}
                  leftElement="R$"
                />

                <FloatingInput
                  label="Valor Final"
                  name="valor_final"
                  type="number"
                  value={formValues.valor_final}
                  onChange={(event) => {
                    handleChange(event);
                    setDep((prevDep) => !prevDep);
                  }}
                  isDisabled
                  leftElement="R$"
                />

                <FloatingInput
                  label="Valor da Entrada"
                  name="valor_entrada"
                  type="number"
                  value={formValues.valor_entrada}
                  onChange={(event) => {
                    handleChange(event);
                    setDep((prevDep) => !prevDep);
                  }}
                  leftElement="R$"
                />

                <FloatingInput
                  label="Valor Restante"
                  name="valor_restante"
                  type="number"
                  value={formValues.valor_restante}
                  onChange={(event) => {
                    handleChange(event);
                    setDep((prevDep) => !prevDep);
                  }}
                  isDisabled
                  leftElement="R$"
                />

                <FloatingInput
                  label="Observações"
                  name="observacoes"
                  value={formValues.observacoes}
                  onChange={handleChange}
                  maxLength={250}
                />
              </Grid>
              
              <Button
                colorScheme="green"
                onClick={handleAtualizarLocacao}
                isLoading={isLoadingAtt}
                loadingText="Atualizando..."
              >
                Atualizar
              </Button>

              <Divider />

              <Button
                colorScheme="red"
                onClick={handleDeletarLocacao}
                isLoading={isLoadingDel}
                loadingText="Deletando..."
              >
                Deletar
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </GridItem>

      {/* Componentes de Trajes e Acessórios aqui */}
    </Grid>
  )


  return (
    <Box p={4}>
      <Flex gap={8}>
        <Box>
          <BuscaForm />
        </Box>
  
        <Divider orientation="vertical" height="auto" borderColor="gray.300" />
  
        <Box flex={1}>
          {locacaoEncontrado === undefined ? null : locacaoEncontrado ? (
            <FormularioPrincipal />
          ) : (
            <Box>
              {mensagemErro && (
                <Text color="red.500" mb={4}>
                  {typeof mensagemErro === 'object' ? mensagemErro.message : mensagemErro}
                </Text>
              )}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

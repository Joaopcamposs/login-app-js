import { useLocation } from 'react-router-dom';
import './styles/Inicio.css'
import SidebarMenu from '../components/SideBarMenu'
import ProximasLocacoes from './contexto_de_negocios/inicio/ProximasLocacoes'
import Locacao from './contexto_de_negocios/locacao/Locacao'
import GeradorContrato from './contexto_de_negocios/contrato/GeradorContrato'
import Clientes from './contexto_de_negocios/clientes/Clientes'
import Disponibilidades from './contexto_de_negocios/disponibilidades/Disponibilidades'
import Trajes from './contexto_de_negocios/trajes/Trajes'
import Acessorios from './contexto_de_negocios/acessorios/Acessorios'
import Usuarios from './contexto_de_negocios/usuarios/Usuarios'


export default function Inicio() {
  const location = useLocation();
  const [, , entidadeRaw, operacaoRaw] = location.pathname.split('/');

  const entidade = entidadeRaw || 'inicio';
  const operacao = operacaoRaw || 'consultar';

  const renderConteudoCentral = () => {
    if (entidade === 'inicio') return <ProximasLocacoes />;
    if (entidade === 'locacao') return <Locacao operacao={operacao} />;
    if (entidade === 'contrato') return <GeradorContrato />;
    if (entidade === 'clientes') return <Clientes />;
    if (entidade === 'disponibilidades') return <Disponibilidades />;
    if (entidade === 'trajes') return <Trajes />;
    if (entidade === 'acessorios') return <Acessorios />;
    if (entidade === 'usuarios') return <Usuarios />;
    return <div>Selecione uma opção no menu</div>;
  };

  return (
    <div className="inicio">
      <SidebarMenu />
      <div className="main-content">{renderConteudoCentral()}</div>
    </div>
  );
}

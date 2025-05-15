import { useLocation } from 'react-router-dom';
import './styles/Inicio.css'
import SidebarMenu from '../components/SideBarMenu'
import ProximasLocacoes from './contexto_de_negocios/inicio/ProximasLocacoes'
import Locacao from './contexto_de_negocios/locacao/Locacao'


export default function Inicio() {
  const location = useLocation();
  const [, , entidadeRaw, operacaoRaw] = location.pathname.split('/');

  const entidade = entidadeRaw || 'inicio';
  const operacao = operacaoRaw || 'consultar';

  const renderConteudoCentral = () => {
    if (entidade === 'inicio') return <ProximasLocacoes />;
    if (entidade === 'locacao') return <Locacao operacao={operacao} />;
    return <div>Selecione uma opção no menu</div>;
  };

  return (
    <div className="inicio">
      <SidebarMenu />
      <div className="main-content">{renderConteudoCentral()}</div>
    </div>
  );
}

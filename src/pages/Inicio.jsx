import { useState } from 'react'
import './styles/Inicio.css'
import SidebarMenu from '../components/SideBarMenu'
import ProximasLocacoes from './contexto_de_negocios/inicio/ProximasLocacoes'
import Locacao from './contexto_de_negocios/locacao/Locacao'


export default function Inicio() {
  const [entidade, setEntidade] = useState('inicio')

  const renderConteudoCentral = () => {
    if (entidade === 'inicio') return <ProximasLocacoes />
    if (entidade === 'locacao') return <Locacao />
    return <div>Selecione uma opção no menu</div>
  }

  return (
    <div className="inicio">
      <SidebarMenu setEntidade={setEntidade} />
      <div className="main-content">
        {renderConteudoCentral()}
      </div>
    </div>
  )
}

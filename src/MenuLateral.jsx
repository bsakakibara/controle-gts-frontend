import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, FileLock, FileText, BarChart, PersonCircle, BoxArrowRight, ArrowRight, Pencil } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const MenuLateral = () => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [menuUsuarioVisivel, setMenuUsuarioVisivel] = useState(false);
  const navegar = useNavigate();

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const sair = () => {
    navegar('/entrada-valores');
  };

  const alternarMenuUsuario = () => {
    setMenuUsuarioVisivel(!menuUsuarioVisivel);
  };

  // Função para fechar o menu
  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className="d-flex">
      {/* Barra Superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" 
      style={{ background: 'linear-gradient(135deg, #4e6ef2, #1d2b64)'}}>
        <button className="btn text-white" onClick={alternarMenu}>
          {menuAberto ? '←' : '→'}
        </button>
        <span className="navbar-brand ms-3">Controle Financeiro</span>

        <div className="ms-auto">
          <button className="btn text-white" onClick={alternarMenuUsuario}>
            <PersonCircle size={20} />
          </button>
          {menuUsuarioVisivel && (
            <div className="dropdown-menu dropdown-menu-end show">
              <button className="dropdown-item" onClick={() => navegar('/perfil')}>Perfil</button>
              <button className="dropdown-item" onClick={sair}>Sair</button>
            </div>
          )}
        </div>
      </nav>

      {/* Menu Lateral */}
      {menuAberto && (
        <div className="bg-light text-dark vh-100 p-2 transition-all" style={{ width: '385px', transition: 'all 0.3s ease', backgroundColor: '#fff' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold">
              <h5>Menu</h5>
            </div>
            <button className="btn text-dark p-0" onClick={alternarMenu} style={{ fontSize: '1.5rem' }}>
              {menuAberto ? '←' : '→'}
            </button>
          </div>

          {/* Itens do Menu */}
          <ul className="list-unstyled mt-5">
            <li className="mb-3">
              <Link to="/entrada-valores" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <Wallet size={20} className="me-3" />
                <span>Entrada de Valores</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/editar-entrada" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <Pencil size={20} className="me-3" />
                <span>Editar Valores de Entrada</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/valores-despesas" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <FileText size={20} className="me-3" />
                <span>Valores de Despesas</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/editar-despesa" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <FileText size={20} className="me-3" />
                <span>Editar Despesas</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/resumo-financeiro" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <BarChart size={20} className="me-3" />
                <span>Resumo Financeiro</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/relatorios" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <BarChart size={20} className="me-3" />
                <span>Relatório</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/" className="text-dark text-decoration-none d-flex align-items-center" onClick={fecharMenu}>
                <BoxArrowRight size={20} className="me-3" />
                <span>Sair</span>
                <ArrowRight size={18} className="ms-auto" />
              </Link>
            </li>
          </ul>
          <div style={{ marginLeft: -8 }}>
            <footer className="mt-auto p-3 text-center" style={{ backgroundColor: '#ddd', color: '#4e6ef2', fontSize: '1rem', position: 'absolute', bottom: 0, width: '100%' }}>
              Sistema sakakibara's: v1.0
            </footer>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className={`flex-grow-1 p-3 ${menuAberto ? 'd-none' : ''}`} style={{ zIndex: 1, marginTop: '56px' }}></div>
    </div>
  );
};

export default MenuLateral;
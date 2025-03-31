import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaInicial from './PaginaInicial';
import MenuLateral from './MenuLateral';
import EntradaDeValores from './componentes/EntradaDeValores';
import Relatorios from './componentes/Relatorios';
import EditarEntrada from './componentes/EditarEntrada';
import ValoresDespesas from './componentes/ValoresDespesas';
import EditarDespesa from './componentes/EditarDespesa';
import ResumoFinanceiro from './componentes/ResumoFinanceiro';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<PaginaInicial />} />

        {/* Layout com Menu Lateral e Superior */}
        <Route
          path="/*"
          element={
            <div className="d-flex">
              <MenuLateral />
              <div className="flex-grow-1 p-3" style={{ marginTop: '56px' }}>
                <Routes>
                  <Route path="/resumo-financeiro" element={<ResumoFinanceiro />} />
                  <Route path="/editar-despesa" element={<EditarDespesa />} />
                  <Route path="/entrada-valores" element={<EntradaDeValores />} />
                  <Route path="/editar-entrada" element={<EditarEntrada />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/valores-despesas" element={<ValoresDespesas />} />
                  <Route path="/editar-despesa" element={<EditarDespesa />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
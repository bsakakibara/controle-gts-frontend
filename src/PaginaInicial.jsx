import React from 'react';
import { Link } from 'react-router-dom';

const PaginaInicial = () => {
    return (
        <div className="text-center">
            <h2>Bem-vindo ao Controle Financeiro</h2>
            <p>Clique no link abaixo para navegar.</p>
            <div className="container mt-5">
                <h1 className="text-center">Meu Aplicativo Financeiro</h1>
                <nav className="mb-4">
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/entrada-valores">Controle Financeiro</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default PaginaInicial;
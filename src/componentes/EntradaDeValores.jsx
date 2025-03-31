import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus } from 'react-bootstrap-icons';

const EntradaDeValores = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState('Ane');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [valoresEntrada, setValoresEntrada] = useState({ Ane: [], Bruno: [] }); 

  // Carregar os valores de entrada do servidor
  const carregarValoresEntrada = () => {
    fetch('http://localhost:3008/api/entrada')
      .then((response) => response.json())
      .then((data) => {
        const valoresOrganizados = { Ane: [], Bruno: [] }; 
        data.forEach((item) => {
          if (item.pessoa === 'Ane') {
            valoresOrganizados.Ane.push({ descricao: item.descricao, valor: item.valor });
          } else if (item.pessoa === 'Bruno') {
            valoresOrganizados.Bruno.push({ descricao: item.descricao, valor: item.valor });
          }
        });
        setValoresEntrada(valoresOrganizados); 
      })
      .catch((error) => console.error('Erro ao buscar os valores de entrada:', error));
  };

  useEffect(() => {
    carregarValoresEntrada();
  }, []);

  // Adicionar valor de entrada
  const adicionarValor = () => {
    if (!descricao || !valor || isNaN(valor)) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    // Atualizar o estado local com o novo valor de entrada antes de fazer a requisição
    const novoValorEntrada = { descricao, valor: parseFloat(valor) }; 
    const novosValoresEntrada = { ...valoresEntrada, [tipoSelecionado]: [...valoresEntrada[tipoSelecionado], novoValorEntrada] }; 
    setValoresEntrada(novosValoresEntrada);

    // Enviar para a API
    fetch('http://localhost:3008/api/entrada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pessoa: tipoSelecionado,
        descricao,
        valor: parseFloat(valor),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        carregarValoresEntrada(); 
        setDescricao('');
        setValor('');
      })
      .catch((error) => {
        console.error('Erro ao adicionar valor de entrada:', error);
      });
  };

  // Calcular o total de valores de entrada por pessoa
  const calcularTotal = (pessoa) => {
    return valoresEntrada[pessoa].reduce((total, item) => total + item.valor, 0);
  };

  // Formatar o valor para moeda brasileira
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para lidar com a tecla Enter
  const botaoEnter = (event) => {
    if (event.key === 'Enter') {
      adicionarValor();
    }
  };

  // Função para formatar o valor enquanto o usuário digita
  const formatarValor = (e) => {
    let valorInput = e.target.value;

    // Remover tudo que não seja número ou vírgula
    valorInput = valorInput.replace(/[^\d,.-]/g, '');

    // Substituir vírgula por ponto, caso necessário
    valorInput = valorInput.replace(',', '.');

    // Manter o valor formatado como moeda
    setValor(valorInput);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container d-flex flex-column align-items-center px-3 py-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Entrada de Valores</h2>

        <div className="card p-4 shadow border-0 rounded-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
          <h5 className="text-primary">Valores Adicionais</h5>

          {/* Selecao de Ane ou Bruno */}
          <div className="mb-4">
            <div className="d-flex justify-content-center gap-3">
              <div>
                <input
                  type="radio"
                  id="ane"
                  name="tipo"
                  value="Ane"
                  checked={tipoSelecionado === 'Ane'}
                  onChange={() => setTipoSelecionado('Ane')}
                  className="form-check-input"
                />
                <label htmlFor="ane" className="ms-2">Ane</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="bruno"
                  name="tipo"
                  value="Bruno"
                  checked={tipoSelecionado === 'Bruno'}
                  onChange={() => setTipoSelecionado('Bruno')}
                  className="form-check-input"
                />
                <label htmlFor="bruno" className="ms-2">Bruno</label>
              </div>
            </div>
          </div>

          {/* Campos de Descrição e Valor */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onKeyPress={botaoEnter}
              maxLength={50}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Valor"
              value={valor.replace('.', ',')}
              onChange={formatarValor}
              onKeyPress={botaoEnter}
            />
          </div>

          {/* Botão para Adicionar */}
          <button className="btn btn-success w-100 mb-3" onClick={adicionarValor}>
            <Plus size={20} /> Adicionar
          </button>

          {/* Totais */}
          <div className="alert alert-success fw-bold mt-3 rounded-4">
            <h5 className="m-2" style={{ fontSize: '14px' }}>Total Ane: {formatarMoeda(calcularTotal('Ane'))}</h5>
            <h5 className="m-2" style={{ fontSize: '14px' }}>Total Bruno: {formatarMoeda(calcularTotal('Bruno'))}</h5>
            <h5 className="m-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>Total Geral: {formatarMoeda(calcularTotal('Ane') + calcularTotal('Bruno'))}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntradaDeValores;
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 

const ValoresDespesas = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState('Ane');
  const [tipoDespesa, setTipoDespesa] = useState('fixa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(new Date());
  const [valoresDespesa, setValoresDespesa] = useState({ Ane: [], Bruno: [] });

  // Carregar os valores de despesa do servidor
  const carregarValoresDespesa = () => {
    fetch('http://localhost:3008/api/despesa')
      .then((response) => response.json())
      .then((data) => {
        const valoresOrganizados = { Ane: [], Bruno: [] };
        data.forEach((item) => {
          if (item.pessoa === 'Ane') {
            valoresOrganizados.Ane.push({ descricao: item.descricao, valor: item.valor, tipoDespesa: item.tipoDespesa });
          } else if (item.pessoa === 'Bruno') {
            valoresOrganizados.Bruno.push({ descricao: item.descricao, valor: item.valor, tipoDespesa: item.tipoDespesa });
          }
        });
        setValoresDespesa(valoresOrganizados);
      })
      .catch((error) => console.error('Erro ao buscar os valores de despesa:', error));
  };

  useEffect(() => {
    carregarValoresDespesa();
  }, []);

  // Adicionar despesa
  const adicionarDespesa = () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (!descricao || isNaN(valorNumerico)) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    const novoValorDespesa = { descricao, valor: valorNumerico, tipoDespesa, vencimento: vencimento.toISOString().split('T')[0] }; 
    const novosValoresDespesa = {
      ...valoresDespesa,
      [tipoSelecionado]: [...valoresDespesa[tipoSelecionado], novoValorDespesa],
    };
    setValoresDespesa(novosValoresDespesa);

    // Enviar para a API
    fetch('http://localhost:3008/api/despesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pessoa: tipoSelecionado,
        descricao,
        valor: valorNumerico,
        tipoDespesa,
        vencimento: vencimento.toISOString().split('T')[0], 
      }),
    })
      .then(() => {
        carregarValoresDespesa();
        setDescricao('');
        setValor('');
        setVencimento(new Date()); 
      })
      .catch((error) => console.error('Erro ao adicionar despesa:', error));
  };

  // Calcular o total de despesas por pessoa
  const calcularTotalDespesas = (pessoa) => {
    return valoresDespesa[pessoa].reduce((total, item) => total + item.valor, 0);
  };

  // Formatar o valor para moeda brasileira
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container d-flex flex-column align-items-center px-3 py-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Despesas</h2>

        <div className="card p-4 shadow border-0 rounded-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
          <h5 className="text-primary">Valores de Despesas</h5>

          {/* Selecao de Ane ou Bruno */}
          <div className="mb-3">
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

          {/* Seleção do tipo de despesa */}
          <div className="d-flex justify-content-center gap-3 mb-3">
            <button className={`btn ${tipoDespesa === 'fixa' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTipoDespesa('fixa')}>
              Despesa Fixa
            </button>
            <button className={`btn ${tipoDespesa === 'variável' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTipoDespesa('variável')}>
              Despesa Variável
            </button>
          </div>

          {/* Campos de Descrição e Valor */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Valor"
              value={valor.replace('.', ',')}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {/* Campo para a data de vencimento */}
          <div className="mb-3">
            <label htmlFor="vencimento" className="form-label">Data de Vencimento</label>
            <DatePicker
              selected={vencimento}
              onChange={(date) => setVencimento(date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              id="vencimento"
              placeholderText="Selecione a data de vencimento"
            />
          </div>

          {/* Botão para Adicionar */}
          <button className="btn btn-danger w-100 mb-3" onClick={adicionarDespesa}>
            <Plus size={20} /> Adicionar
          </button>

          {/* Totais */}
          <div className="alert alert-danger fw-bold mt-3 rounded-4">
            <h5 className="m-2" style={{ fontSize: '14px' }}>Total Ane: {formatarMoeda(calcularTotalDespesas('Ane'))}</h5>
            <h5 className="m-2" style={{ fontSize: '14px' }}>Total Bruno: {formatarMoeda(calcularTotalDespesas('Bruno'))}</h5>
            <h5 className="m-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>Total Geral: {formatarMoeda(calcularTotalDespesas('Ane') + calcularTotalDespesas('Bruno'))}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValoresDespesas;
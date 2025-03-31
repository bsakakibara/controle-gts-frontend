import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash } from 'react-bootstrap-icons';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditarDespesa = () => {
  const [valoresDespesa, setValoresDespesa] = useState([]);
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipoDespesa, setTipoDespesa] = useState('variável');
  const [data, setData] = useState(new Date()); 

  // Carregar os valores de despesa do servidor
  const carregarValoresDespesa = () => {
    console.log('Carregando valores de despesa...');
    fetch('http://localhost:3008/api/despesa')
      .then((response) => response.json())
      .then((data) => {
        console.log('Valores recebidos:', data);
        setValoresDespesa(data);
      })
      .catch((error) => console.error('Erro ao buscar os valores de despesa:', error));
  };

  useEffect(() => {
    carregarValoresDespesa();
  }, []);

  // Formatar o valor para moeda brasileira
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    return isNaN(dataFormatada.getTime()) ? 'Data inválida' : dataFormatada.toLocaleDateString('pt-BR');
  };

  // Função para editar uma despesa
  const editarDespesa = (despesa) => {
    setDespesaEditando(despesa);
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setTipoDespesa(despesa.tipoDespesa);
  
    // Verificando e corrigindo a data recebida
    const dataRecebida = new Date(despesa.vencimento);
    if (isNaN(dataRecebida.getTime())) {
      console.error("Data inválida:", despesa.vencimento);
      setData(new Date());  
    } else {
      setData(dataRecebida); 
    }
  };

  // Função para salvar / editar as alterações
  const salvarEdicao = () => {
    if (!descricao || !valor || !tipoDespesa || !data) {
      alert('Descrição, valor, tipo de despesa e data são obrigatórios');
      return;
    }

    const id = despesaEditando.id;

    fetch(`http://localhost:3008/api/despesa/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao,
        valor,
        tipoDespesa,
        data,  // Enviando a data da despesa
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Despesa atualizada com sucesso") {
          carregarValoresDespesa();
          setDespesaEditando(null);
          setDescricao('');
          setValor('');
          setTipoDespesa('variável');
          setData(new Date()); // Resetando a data
        } else {
          alert(data.message || 'Erro ao editar');
        }
      })
      .catch((error) => console.error('Erro ao editar a despesa:', error));
  };

  // Função para excluir uma despesa
  const excluirDespesa = (id) => {
    if (!id) {
      console.error('ID da despesa não encontrado');
      return;
    }

    fetch(`http://localhost:3008/api/despesa/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setValoresDespesa((prevState) => prevState.filter((item) => item.id !== id));
        } else {
          response.json().then((data) => {
            alert(data.message || 'Erro ao excluir');
          });
        }
      })
      .catch((error) => console.error('Erro ao excluir a despesa:', error));
  };

  // Calcular o total de todas as despesas
  const calcularTotal = () => {
    return valoresDespesa.reduce((total, despesa) => total + parseFloat(despesa.valor), 0);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ marginLeft: -24 }}>
      <div className="container">
        <h3 className="text-center mb-4 text-primary fw-bold" style={{ fontSize: '1.2rem' }}>Editar Despesas</h3>
        {/* Formulário de Edição */}
        {despesaEditando && (
          <div className="mb-4">
            <h6 className="text-primary" style={{ fontSize: '1rem' }}>Editar Despesa</h6>
            <Form>
              <Form.Group controlId="descricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="valor">
                <Form.Label>Valor</Form.Label>
                <Form.Control
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="tipoDespesa">
                <Form.Label>Tipo de Despesa</Form.Label>
                <Form.Control
                  as="select"
                  value={tipoDespesa}
                  onChange={(e) => setTipoDespesa(e.target.value)}
                >
                  <option value="variável">Variável</option>
                  <option value="fixa">Fixa</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="data">
                <Form.Label>Data</Form.Label>
                <DatePicker
                  selected={data}
                  onChange={(date) => setData(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Button variant="primary" className="mt-3" onClick={salvarEdicao}>
                Salvar
              </Button>
            </Form>
          </div>
        )}

        {/* Lista de Despesas */}
        <div className="mb-4">
          <h6 className="text-primary" style={{ fontSize: '1rem' }}>Despesas</h6>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover" style={{ fontSize: '0.9rem' }}>
              <thead style={{ fontSize: '0.8rem' }}>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo de Despesa</th>
                  <th>Data</th> {/* Coluna de data */}
                  <th>Vagabundo que gastou</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {valoresDespesa.map((despesa) => (
                  <tr key={despesa.id}>
                    <td>{despesa.descricao}</td>
                    <td>{formatarMoeda(despesa.valor)}</td>
                    <td>{despesa.tipoDespesa}</td>
                    <td>{formatarData(despesa.data)}</td>
                    <td>{despesa.pessoa}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarDespesa(despesa)}
                      >
                        <Pencil size={10} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => excluirDespesa(despesa.id)}
                      >
                        <Trash size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Exibir o valor total */}
          <h5 className="text-end text-primary mt-3">
            Total de Despesas: {formatarMoeda(calcularTotal())}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default EditarDespesa;
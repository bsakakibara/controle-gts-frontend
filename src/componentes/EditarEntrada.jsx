import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash } from 'react-bootstrap-icons';
import { Button, Form } from 'react-bootstrap';

const EditarEntrada = () => {
  const [valoresEntrada, setValoresEntrada] = useState({ Ane: [], Bruno: [] });
  const [entradaEditando, setEntradaEditando] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  // Carregar os valores de entrada do servidor
  const carregarValoresEntrada = () => {
    console.log('Carregando valores de entrada...');
    fetch('http://localhost:3008/api/entrada')
      .then((response) => response.json())
      .then((data) => {
        console.log('Valores recebidos:', data);
        const valoresOrganizados = { Ane: [], Bruno: [] };
        data.forEach((item) => {
          if (item.pessoa === 'Ane') {
            valoresOrganizados.Ane.push({ id: item.id, descricao: item.descricao, valor: item.valor });
          } else if (item.pessoa === 'Bruno') {
            valoresOrganizados.Bruno.push({ id: item.id, descricao: item.descricao, valor: item.valor });
          }
        });
        console.log('Valores organizados:', valoresOrganizados);
        setValoresEntrada(valoresOrganizados);
      })
      .catch((error) => console.error('Erro ao buscar os valores de entrada:', error));
  };

  useEffect(() => {
    carregarValoresEntrada();
  }, []);

  // Formatar o valor para moeda brasileira
  const formatarMoeda = (valor) => {
    console.log('Formatando valor:', valor);
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular total de valores de entrada
  const calcularTotal = (lista) => {
    console.log('Calculando total da lista:', lista);
    return lista.reduce((total, item) => total + item.valor, 0);
  };

  // Função para editar uma entrada
  const editarEntrada = (entrada) => {
    console.log('Editando entrada:', entrada);
    setEntradaEditando(entrada);
    setDescricao(entrada.descricao);
    setValor(entrada.valor);
  };

  // Função para salvar / editar as alterações
  const salvarEdicao = () => {
    if (!descricao || !valor) {
      alert('Descrição e valor são obrigatórios');
      return;
    }

    const id = entradaEditando.id;
    console.log('Salvando edição para ID:', id);

    fetch(`http://localhost:3008/api/entrada/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao,
        valor,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Resposta da edição:', data);
        if (data.message === "Entrada de valores atualizada com sucesso") {
          carregarValoresEntrada(); 
          setEntradaEditando(null);
          setDescricao('');
          setValor('');
        } else {
          alert(data.message || 'Erro ao editar');
        }
      })
      .catch((error) => console.error('Erro ao editar o Entrada de valor:', error));
  };

  // Função para excluir uma entrada
  const excluirEntrada = (id) => {
    console.log('Excluindo entrada com ID:', id);
    if (!id) {
      console.error('ID da entrada não encontrado');
      return;
    }

    fetch(`http://localhost:3008/api/entrada/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setValoresEntrada((prevState) => {
            const novosValores = { ...prevState };
            novosValores.Ane = novosValores.Ane.filter((item) => item.id !== id);
            novosValores.Bruno = novosValores.Bruno.filter((item) => item.id !== id);
            console.log('Novos valores após exclusão:', novosValores);
            return novosValores;
          });
        } else {
          return response.json().then((data) => {
            alert(data.message || 'Erro ao excluir');
          });
        }
      })
      .catch((error) => console.error('Erro ao excluir o Entrada de valor:', error));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <div className="container">
        <h3 className="text-center mb-4 text-primary fw-bold" style={{ fontSize: '1.2rem' }}>Editar Entradas</h3>
        {/* Formulário de Edição */}
        {entradaEditando && (
          <div className="mb-4">
            <h6 className="text-primary" style={{ fontSize: '1rem' }}>Editar Entrada</h6>
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
              <Button variant="primary" className="mt-3" onClick={salvarEdicao}>
                Salvar
              </Button>
            </Form>
          </div>
        )}

        {/* Lista de Valores de Entrada Ane */}
        <div className="mb-4">
          <h6 className="text-primary" style={{ fontSize: '1rem' }}>Entrada de Ane</h6>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Total: {formatarMoeda(calcularTotal(valoresEntrada.Ane))}</p>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {valoresEntrada.Ane.map((valorEntrada, index) => (
                  <tr key={index}>
                    <td>{valorEntrada.descricao}</td>
                    <td>{formatarMoeda(valorEntrada.valor)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarEntrada(valorEntrada)}
                      >
                        <Pencil size={10} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => excluirEntrada(valorEntrada.id)}
                      >
                        <Trash size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h6 className="text-primary" style={{ fontSize: '1rem' }}>Entrada de Bruno</h6>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Total: {formatarMoeda(calcularTotal(valoresEntrada.Bruno))}</p>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {valoresEntrada.Bruno.map((valorEntrada, index) => (
                  <tr key={index}>
                    <td>{valorEntrada.descricao}</td>
                    <td>{formatarMoeda(valorEntrada.valor)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarEntrada(valorEntrada)}
                      >
                        <Pencil size={10} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => excluirEntrada(valorEntrada.id)}
                      >
                        <Trash size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEntrada;
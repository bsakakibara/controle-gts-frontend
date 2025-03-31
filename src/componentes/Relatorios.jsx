import React, { useEffect, useState } from 'react';

const Relatorios = () => {
  const [dadosEntrada, setDadosEntrada] = useState(null);

  useEffect(() => {
    // Fazer requisição para o backend e obter os dados
    fetch('http://localhost:3008/api/gastos')  
      .then((response) => response.json())
      .then((data) => {
        // Transformar os dados para o formato que você precisa
        const dadosFormatados = {
          salarioAne: 3000, 
          salarioBruno: 2500, 
          despesas: {
            Ane: data.filter((item) => item.categoria === 'Alimentação' && item.descricao.includes('Ane')),  // Exemplo de filtro, ajuste conforme necessário
            Bruno: data.filter((item) => item.categoria === 'Alimentação' && item.descricao.includes('Bruno'))  // Exemplo de filtro, ajuste conforme necessário
          }
        };

        setDadosEntrada(dadosFormatados);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      });
  }, []);

  if (!dadosEntrada) {
    return <div>Carregando...</div>;
  }

  const { salarioAne, salarioBruno, despesas } = dadosEntrada;
  const totalAne = despesas.Ane.reduce((acc, despesa) => acc + despesa.valor, 0);
  const totalBruno = despesas.Bruno.reduce((acc, despesa) => acc + despesa.valor, 0);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Relatório de Valores</h2>

      <div className="card p-4 shadow border-0 rounded-4">
        <h5>Salário</h5>
        <ul>
          <li>Ane: R$ {salarioAne.toFixed(2)}</li>
          <li>Bruno: R$ {salarioBruno.toFixed(2)}</li>
        </ul>

        <h5>Despesas Adicionais</h5>
        <h6>Ane: R$ {totalAne.toFixed(2)}</h6>
        <ul>
          {despesas.Ane.map((item, index) => (
            <li key={index}>{item.descricao} - R$ {item.valor.toFixed(2)}</li>
          ))}
        </ul>

        <h6>Bruno: R$ {totalBruno.toFixed(2)}</h6>
        <ul>
          {despesas.Bruno.map((item, index) => (
            <li key={index}>{item.descricao} - R$ {item.valor.toFixed(2)}</li>
          ))}
        </ul>

        <div className="alert alert-info mt-3">
          <h4>Total Geral: R$ {(salarioAne + salarioBruno + totalAne + totalBruno).toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
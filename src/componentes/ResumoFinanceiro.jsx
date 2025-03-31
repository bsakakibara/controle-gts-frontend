import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaArrowCircleUp, FaArrowCircleDown, FaDollarSign } from "react-icons/fa";

const ResumoFinanceiro = () => {
  const [entradas, setEntradas] = useState(0);
  const [despesas, setDespesas] = useState(0);

  useEffect(() => {
    // Buscar as entradas
    fetch("http://localhost:3008/api/entrada")
      .then((response) => response.json())
      .then((data) => {
        const totalEntradas = data.reduce((acc, entry) => acc + entry.valor, 0);
        setEntradas(totalEntradas);
      })
      .catch((error) => console.error("Erro ao buscar entradas:", error));

    // Buscar as despesas
    fetch("http://localhost:3008/api/despesa")
      .then((response) => response.json())
      .then((data) => {
        const totalDespesas = data.reduce((acc, expense) => acc + expense.valor, 0);
        setDespesas(totalDespesas);
      })
      .catch((error) => console.error("Erro ao buscar despesas:", error));
  }, []);

  const saldo = entradas - despesas;
  const saldoClasse = saldo >= 0 ? "text-success" : "text-danger";

  return (
    <Card className="mt-4 shadow-lg p-4 rounded border-0" style={{ backgroundColor: "#f9f9f9" }}>
      <Card.Body>
        <Card.Title className="text-center fw-bold" style={{ fontSize: '24px', color: '#333' }}>
          Resumo Financeiro
        </Card.Title>
        <hr />
        
        {/* Entradas e Despesas com ícones e valores */}
        <Row className="text-center">
          <Col sm={6}>
            <div className="d-flex flex-column align-items-center">
              <FaArrowCircleUp size={40} color="#4CAF50" />
              <span className="fw-semibold mt-2" style={{ fontSize: '16px', color: '#4CAF50' }}>Entradas</span>
              <span className="fw-bold" style={{ fontSize: '18px' }}>R$ {entradas.toFixed(2)}</span>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex flex-column align-items-center">
              <FaArrowCircleDown size={40} color="#F44336" />
              <span className="fw-semibold mt-2" style={{ fontSize: '16px', color: '#F44336' }}>Despesas</span>
              <span className="fw-bold" style={{ fontSize: '18px' }}>R$ {despesas.toFixed(2)}</span>
            </div>
          </Col>
        </Row>
        
        <hr />
        
        {/* Saldo Final */}
        <Row className="d-flex justify-content-between mt-3">
          <Col>
            <span className="fw-semibold" style={{ fontSize: '18px', color: '#333' }}>Saldo Final</span>
          </Col>
          <Col className="text-end">
            <div className={`fw-bold ${saldoClasse}`} style={{ fontSize: '20px' }}>
              <FaDollarSign size={24} color={saldo >= 0 ? "#4CAF50" : "#F44336"} />
              R$ {saldo.toFixed(2)}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ResumoFinanceiro;
import React, { useState } from 'react';

// Função para formatar o valor para o formato Real (R$)
const formatarValor = (valor) => {
  return valor
    .replace(/\D/g, '') 
    .replace(/(\d)(\d{2})$/, '$1,$2') 
    .replace(/(?=(\d{3})+(\.))/g, '$1.') 
    .replace(/(\.\d{2})\d+$/, '$1'); 
};

const EntradaValor = ({ valor, setValor, label, placeholder }) => {
  const [inputValue, setInputValue] = useState(valor);

  const handleChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setInputValue(valorFormatado);
    setValor(valorFormatado);
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        pattern="[0-9]*"
        className="form-control form-control-lg text-center"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ borderRadius: '12px' }}
      />
    </div>
  );
};

export default EntradaValor;
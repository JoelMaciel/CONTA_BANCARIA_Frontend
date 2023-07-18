import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [operador, setOperador] = useState("");
  const [transferencias, setTransferencias] = useState([]);
  const [saldoPeriodo, setSaldoPeriodo] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/api/transferencias/");
      const data = await response.json();
      setTransferencias(data);
    };
    fetchData();
  }, []);

  const searchTransactions = async (dataInicial, dataFinal, operador) => {
    const novaDataInicial = encodeURIComponent(dataInicial);
    const novaDataFinal = encodeURIComponent(dataFinal);
    const novoOperador = operador;
    let response;

    if (
      (dataInicial.length === 0 || dataFinal.length === 0) &&
      operador.length === 0
    ) {
      response = await fetch("http://localhost:8080/api/transferencias/");
    } else if (
      (dataInicial.length === 0 || dataFinal.length === 0) &&
      operador.length >= 1
    ) {
      response = await fetch(
        `http://localhost:8080/api/transferencias?nomeOperadorTransacao=${novoOperador}`
      );
    } else {
      response = await fetch(
        `http://localhost:8080/api/transferencias?dataInicial=${novaDataInicial}&dataFinal=${novaDataFinal}`
      );
    }

    const data = await response.json();
    setTransferencias(data);

    let saldo = 0;
    data.forEach((transferencia) => {
      saldo += transferencia.valor;
    });
    setSaldoPeriodo(saldo);
    setSaldoTotal(saldo);
  };

  return (
    <div className="container">
      <div className="data-inicio">
        <label htmlFor="start-date">Data Inícial:</label>
        <input
          type="date"
          id="start-date"
          value={dataInicial}
          onChange={(e) => setDataFinal(e.target.value)}
        />
      </div>
      <div className="data-fim">
        <label htmlFor="end-date">Data Final:</label>
        <input
          type="date"
          id="end-date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
        />
      </div>
      <div className="nome-operador">
        <label htmlFor="operator">Nome do operador:</label>
        <input
          type="text"
          id="operator"
          value={operador}
          onChange={(e) => setOperador(e.target.value)}
        />
      </div>
      <div className="form-pesquisar">
        <button
          onClick={() => searchTransactions(dataInicial, dataFinal, operador)}
        >
          Pesquisar
        </button>
      </div>
      <br />
      <table>
        <thead>
          <tr className="saldo">
            <th className="saldo-total">
              <label>
                <b>Saldo total:</b>
              </label>
              <span>{"R$ " + saldoTotal.toFixed(2)}</span>
            </th>
            <th className="saldo-periodo">
              <label>
                <b>Saldo no período:</b>
              </label>
              <span>{"R$ " + saldoPeriodo.toFixed(2)}</span>
            </th>
          </tr>
          <tr>
            <th>Data</th>
            <th>Valencia</th>
            <th>Tipo de Transferência</th>
            <th>Nome do Operador</th>
          </tr>
        </thead>
        <tbody>
          {transferencias.map((item) => (
            <tr key={item.id}>
              <td>{item.dataTransferencia.substring(0, 10)}</td>
              <td>{"R$ " + item.valor}</td>
              <td>{item.tipo}</td>
              <td>{item.nomeOperadorTransacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./styles.css";

interface Transferencia {
  id: number;
  dataTransferencia: string;
  valor: number;
  tipo: string;
  nomeOperadorTransacao: string;
}

function App() {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [operador, setOperador] = useState("");
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
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

  const buscarTransacoes = async (
    dataInicial: string,
    dataFinal: string,
    operador: string
  ) => {
    const novaDataInicial = dataInicial;
    const novaDataFinal = dataFinal;
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
    data.forEach((transferencia: Transferencia) => {
      saldo += transferencia.valor;
    });
    setSaldoPeriodo(saldo);
    setSaldoTotal(saldo);
  };

  return (
    <div className="container">
      <div className="data-inicial">
        <label htmlFor="data-inicial">Data Inícial:</label>
        <input
          type="date"
          id="data-inicial"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
        />
      </div>
      <div className="data-final">
        <label htmlFor="data-final">Data Final:</label>
        <input
          type="date"
          id="data-final"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
        />
      </div>
      <div className="nome-operador">
        <label htmlFor="operador">Nome do operador:</label>
        <input
          type="text"
          id="operator"
          value={operador}
          onChange={(e) => setOperador(e.target.value)}
        />
      </div>
      <div className="form-pesquisar">
        <button
          onClick={() => buscarTransacoes(dataInicial, dataFinal, operador)}
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
              <td>
                {new Date(item.dataTransferencia).toLocaleDateString("pt-BR")}
              </td>
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

import { useState, useEffect, useCallback } from "react";
import "./styles.css";

interface Transferencia {
  id: number;
  dataTransferencia: string;
  valor: number;
  tipo: string;
  nomeOperadorTransacao: string;
}

function App() {
  const [dataInicial, setDataInicial] = useState<string>();
  const [dataFinal, setDataFinal] = useState<string>();
  const [operador, setOperador] = useState<string>();
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [saldoPeriodo, setSaldoPeriodo] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState<number>();
  const itensPorPagina = 4;

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < (totalPaginas as number)) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const buscarTransacoes = useCallback(async () => {
    const objetoRequisicao = {
      page: paginaAtual - 1,
      size: itensPorPagina,
      nomeOperadorTransacao: operador,
      dataInicial: dataInicial,
      dataFinal: dataFinal,
    };

    const filteredParams = Object.entries(objetoRequisicao)
      .filter(([key, value]) => value !== undefined)
      .reduce((obj: Record<string, any>, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const queryParams = new URLSearchParams(filteredParams as any);

    for (const [key, value] of queryParams.entries()) {
      if (value === "undefined") {
        queryParams.delete(key);
      }
    }

    const response = await fetch(
      "http://localhost:8080/api/transferencias?" + queryParams.toString()
    );
    const data = await response.json();
    const contentTransferencia = data.content || [];
    setTransferencias(contentTransferencia);
    setTotalPaginas(data.totalPages || 1);

    let saldo = 0;
    contentTransferencia.forEach((transferencia: Transferencia) => {
      saldo += transferencia.valor;
    });
    setSaldoPeriodo(saldo);
    setSaldoTotal(saldo);
  }, [operador, dataInicial, dataFinal, paginaAtual, itensPorPagina]);

  useEffect(() => {
    buscarTransacoes();
  }, [buscarTransacoes]);

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
        <button onClick={() => setPaginaAtual(1)}>Pesquisar</button>
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
        <tfoot>
          <tr>
            <td style={{ textAlign: "center" }} colSpan={4}>
              <div className="pagination">
                <button
                  onClick={irParaPaginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  Anterior
                </button>
                <span>{paginaAtual}</span>
                <button
                  onClick={irParaProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;

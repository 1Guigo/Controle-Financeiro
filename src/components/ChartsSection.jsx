import Chart from './Chart'

function ChartsSection({ categoryData, usageData }) {
  return (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
        <h2 className="text-lg font-semibold text-slate-100">Despesas por categoria</h2>
        <p className="mt-1 text-sm text-slate-400">
          Visualize onde o dinheiro está sendo gasto.
        </p>
        <Chart
          type="category"
          data={categoryData}
          emptyMessage="Adicione despesas para exibir este gráfico."
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
        <h2 className="text-lg font-semibold text-slate-100">Uso do dinheiro</h2>
        <p className="mt-1 text-sm text-slate-400">
          Compare o que foi gasto e o que ainda sobrou.
        </p>
        <Chart
          type="usage"
          data={usageData}
          emptyMessage="Defina uma receita ou adicione despesas para começar."
        />
      </div>
    </section>
  )
}

export default ChartsSection


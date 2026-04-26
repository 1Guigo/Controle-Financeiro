import Chart from './Chart'

function ChartsSection({ categoryData, usageData }) {
  return (
    <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="app-surface fade-up p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Despesas por categoria</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Visualize onde o dinheiro está sendo gasto.
        </p>
        <Chart
          type="category"
          data={categoryData}
          emptyMessage="Adicione despesas para exibir este gráfico."
        />
      </div>

      <div className="app-surface fade-up p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Uso do dinheiro</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
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


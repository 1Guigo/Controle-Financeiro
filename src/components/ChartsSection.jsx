import Chart from './Chart'

function ChartsSection({ categoryData }) {
  return (
    <section className="mt-10 grid grid-cols-1 gap-6">
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
    </section>
  )
}

export default ChartsSection


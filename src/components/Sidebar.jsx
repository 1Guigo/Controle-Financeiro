function Sidebar({ months, selectedMonth, onSelectMonth }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
          Finanças
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Painel mensal</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">Selecione o mês para navegar.</p>
      </div>

      <nav className="space-y-1.5">
        {months.map((month) => {
          const isActive = month.key === selectedMonth
          return (
            <button
              type="button"
              key={month.key}
              onClick={() => onSelectMonth(month.key)}
              className={`pressable w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:translate-x-1 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {month.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar


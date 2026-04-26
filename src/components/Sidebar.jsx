function Sidebar({ months, selectedMonth, onSelectMonth }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950/95 p-4 backdrop-blur lg:block">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
          Finanças
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Meses do ano</h2>
      </div>

      <nav className="space-y-1">
        {months.map((month) => {
          const isActive = month.key === selectedMonth
          return (
            <button
              type="button"
              key={month.key}
              onClick={() => onSelectMonth(month.key)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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


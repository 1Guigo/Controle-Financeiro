import Sidebar from './Sidebar'

function Layout({ months, selectedMonth, onSelectMonth, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <Sidebar
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />

        <main className="min-h-screen flex-1 px-4 pb-28 pt-6 sm:px-8 sm:pt-10 lg:pb-12 xl:px-12">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-md backdrop-blur lg:hidden fade-up">
        <div className="flex gap-1 overflow-x-auto">
          {months.map((month) => {
            const isActive = selectedMonth === month.key
            return (
              <button
                type="button"
                key={month.key}
                onClick={() => onSelectMonth(month.key)}
                className={`pressable whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {month.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Layout

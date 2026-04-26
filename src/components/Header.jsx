import { formatCurrencyBRL } from '../lib/finance'

function Header({ monthLabel, balance, onAddExpenseClick }) {
  return (
    <header className="app-surface fade-up mb-10 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            {monthLabel}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {formatCurrencyBRL(balance)}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Saldo disponível no mês atual
          </p>
        </div>

        <button
          type="button"
          onClick={onAddExpenseClick}
          className="pressable rounded-2xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          Adicionar gasto
        </button>
      </div>
    </header>
  )
}

export default Header

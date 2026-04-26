import { formatCurrencyBRL } from '../lib/finance'

function DashboardHeader({ monthLabel, balance }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-300">
          Controle financeiro pessoal
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">
          {monthLabel}
        </h1>
      </div>
      <span className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300">
        Saldo atual: {formatCurrencyBRL(balance)}
      </span>
    </header>
  )
}

export default DashboardHeader


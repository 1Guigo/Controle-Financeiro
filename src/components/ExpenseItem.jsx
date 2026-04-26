import { formatCurrencyBRL } from '../lib/finance'

const CATEGORY_ICONS = {
  Alimentacao: '🍽️',
  Transporte: '🚗',
  Moradia: '🏠',
  Saude: '💊',
  Lazer: '🎮',
  Educacao: '📚',
  Contas: '🧾',
  Outros: '💳',
}

function ExpenseItem({ expense, onRemoveExpense }) {
  const categoryIcon = CATEGORY_ICONS[expense.category] || '💳'

  return (
    <li className="fade-up flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg">
        <span aria-hidden>{categoryIcon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-5 text-slate-900">{expense.description}</p>
        <p className="truncate text-xs tracking-wide text-slate-500">{expense.category}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold tracking-tight text-rose-500">
          {formatCurrencyBRL(expense.amount)}
        </p>
        <button
          type="button"
          onClick={() => onRemoveExpense(expense.id)}
          className="mt-1 text-xs text-slate-400 transition-colors duration-300 hover:text-rose-500"
        >
          Remover
        </button>
      </div>
    </li>
  )
}

export default ExpenseItem

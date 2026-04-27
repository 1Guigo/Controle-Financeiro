import { formatCurrencyBRL } from '../lib/finance'
import { getCategoryColor } from '../lib/categories'

function ExpensesTable({ expenses, onRemoveExpense, onSetInstallmentsPaid }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Tabela de despesas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-3 py-2 font-medium">Descrição</th>
              <th className="px-3 py-2 font-medium">Categoria</th>
              <th className="px-3 py-2 font-medium">Parcelas</th>
              <th className="px-3 py-2 font-medium">Data</th>
              <th className="px-3 py-2 font-medium">Valor</th>
              <th className="px-3 py-2 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                const total = Math.max(1, Number(expense.installmentsTotal || 1))
                const paid = Math.min(Math.max(0, Number(expense.installmentsPaid || 0)), total)
                const remaining = Math.max(0, total - paid)
                const isInstallment = total > 1
                const badgeColor = getCategoryColor(expense.category)

                return (
                  <tr key={expense.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-3 py-3">{expense.description}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-200">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: badgeColor }}
                        />
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {isInstallment ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-300">
                            Pagas {paid}/{total} (faltam {remaining})
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSetInstallmentsPaid(expense.id, paid - 1)}
                              className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                              aria-label="Desfazer parcela paga"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => onSetInstallmentsPaid(expense.id, paid + 1)}
                              className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                              aria-label="Marcar parcela como paga"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {expense.date
                        ? new Date(`${expense.date}T00:00:00`).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-3 py-3 font-medium text-rose-300">
                      {formatCurrencyBRL(expense.amount)}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => onRemoveExpense(expense.id)}
                        className="rounded-md bg-rose-500/20 px-3 py-1.5 text-rose-200 transition hover:bg-rose-500/30"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                  Nenhuma despesa cadastrada neste mês.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpensesTable

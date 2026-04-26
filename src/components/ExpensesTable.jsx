import { formatCurrencyBRL } from '../lib/finance'

function ExpensesTable({ expenses, onRemoveExpense }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Tabela de despesas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-3 py-2 font-medium">Descrição</th>
              <th className="px-3 py-2 font-medium">Categoria</th>
              <th className="px-3 py-2 font-medium">Data</th>
              <th className="px-3 py-2 font-medium">Valor</th>
              <th className="px-3 py-2 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-800/80 text-slate-200">
                  <td className="px-3 py-3">{expense.description}</td>
                  <td className="px-3 py-3">{expense.category}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
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


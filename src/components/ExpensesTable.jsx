import ExpenseItem from './ExpenseItem'

function ExpensesTable({ expenses, onRemoveExpense }) {
  return (
    <section className="app-surface fade-up p-6">
      <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900">
        Histórico de despesas
      </h2>
      {expenses.length > 0 ? (
        <ul className="space-y-3.5">
          {expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} onRemoveExpense={onRemoveExpense} />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Nenhuma despesa cadastrada neste mês.
        </div>
      )}
    </section>
  )
}

export default ExpensesTable


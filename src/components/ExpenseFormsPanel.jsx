import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'

function ExpenseFormsPanel({
  incomeInput,
  expenseForm,
  categories,
  onIncomeInputChange,
  onIncomeSubmit,
  onExpenseFieldChange,
  onExpenseSubmit,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Lançamentos</h2>
      <div className="space-y-4">
        <IncomeForm
          incomeInput={incomeInput}
          onIncomeInputChange={onIncomeInputChange}
          onSubmit={onIncomeSubmit}
        />
        <ExpenseForm
          categories={categories}
          formData={expenseForm}
          onFieldChange={onExpenseFieldChange}
          onSubmit={onExpenseSubmit}
        />
      </div>
    </div>
  )
}

export default ExpenseFormsPanel


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
    <div
      id="expense-form-panel"
      className="app-surface fade-up p-6"
    >
      <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900">Lançamentos</h2>
      <div className="space-y-5">
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


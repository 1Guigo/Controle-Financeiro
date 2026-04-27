import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import { getCategoryColor } from '../lib/categories'

function ExpenseFormsPanel({
  incomeInput,
  incomeDateInput,
  expenseForm,
  categories,
  onIncomeInputChange,
  onIncomeDateChange,
  onIncomeSubmit,
  onIncomeClear,
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
          incomeDateInput={incomeDateInput}
          onIncomeInputChange={onIncomeInputChange}
          onIncomeDateChange={onIncomeDateChange}
          onSubmit={onIncomeSubmit}
          onClearIncome={onIncomeClear}
        />
        <ExpenseForm
          categories={categories}
          formData={expenseForm}
          getCategoryColor={getCategoryColor}
          onFieldChange={onExpenseFieldChange}
          onSubmit={onExpenseSubmit}
        />
      </div>
    </div>
  )
}

export default ExpenseFormsPanel


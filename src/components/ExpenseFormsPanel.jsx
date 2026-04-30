import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import { getCategoryColor } from '../lib/categories'

function ExpenseFormsPanel({
  incomeInputMid,
  incomeInputEnd,
  incomeDateInputMid,
  incomeDateInputEnd,
  investmentsInput,
  expenseForm,
  categories,
  onIncomeInputChange,
  onIncomeDateChange,
  onInvestmentsInputChange,
  onIncomeSubmit,
  onIncomeClear,
  onInvestmentsSubmit,
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
          incomeInputMid={incomeInputMid}
          incomeInputEnd={incomeInputEnd}
          incomeDateInputMid={incomeDateInputMid}
          incomeDateInputEnd={incomeDateInputEnd}
          investmentsInput={investmentsInput}
          onIncomeInputChange={onIncomeInputChange}
          onIncomeDateChange={onIncomeDateChange}
          onInvestmentsInputChange={onInvestmentsInputChange}
          onSubmit={onIncomeSubmit}
          onClearIncome={onIncomeClear}
          onSubmitInvestments={onInvestmentsSubmit}
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


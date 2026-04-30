import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import { getCategoryColor } from '../lib/categories'

function ExpenseFormsPanel({
  incomeInputMid,
  incomeInputEnd,
  incomeDateInputMid,
  incomeDateInputEnd,
  investmentForm,
  investmentsList,
  cashboxInput,
  expenseForm,
  categories,
  onIncomeInputChange,
  onIncomeDateChange,
  onInvestmentFormChange,
  onAddInvestment,
  onRemoveInvestment,
  onCashboxInputChange,
  onSaveCashbox,
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
          incomeInputMid={incomeInputMid}
          incomeInputEnd={incomeInputEnd}
          incomeDateInputMid={incomeDateInputMid}
          incomeDateInputEnd={incomeDateInputEnd}
          investmentForm={investmentForm}
          investmentsList={investmentsList}
          cashboxInput={cashboxInput}
          onIncomeInputChange={onIncomeInputChange}
          onIncomeDateChange={onIncomeDateChange}
          onInvestmentFormChange={onInvestmentFormChange}
          onAddInvestment={onAddInvestment}
          onRemoveInvestment={onRemoveInvestment}
          onCashboxInputChange={onCashboxInputChange}
          onSaveCashbox={onSaveCashbox}
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


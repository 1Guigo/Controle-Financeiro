import ChartsSection from './components/ChartsSection'
import ExpenseFormsPanel from './components/ExpenseFormsPanel'
import ExpensesTable from './components/ExpensesTable'
import Header from './components/Header'
import Layout from './components/Layout'
import SummaryCards from './components/SummaryCards'
import { useFinanceDashboard } from './hooks/useFinanceDashboard'

function App() {
  const data = useFinanceDashboard()

  function scrollToExpenseForm() {
    const section = document.getElementById('expense-form-panel')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Layout
      months={data.months}
      selectedMonth={data.selectedMonth}
      onSelectMonth={data.setSelectedMonth}
    >
      <Header
        monthLabel={data.monthLabel}
        balance={data.balance}
        calculatedBalance={data.calculatedBalance}
        manualBalanceInput={data.manualBalanceInput}
        onManualBalanceInputChange={data.handleManualBalanceInputChange}
        onSaveManualBalance={data.handleSaveManualBalance}
        onClearManualBalance={data.handleClearManualBalance}
        onAddExpenseClick={scrollToExpenseForm}
      />

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <SummaryCards
            income={data.income}
            cashbox={data.cashbox}
            totalExpenses={data.totalExpenses}
            carryOver={data.carryOver}
          />
        </div>

        <ChartsSection categoryData={data.categoryData} />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_1.3fr]">
        <ExpenseFormsPanel
          incomes={data.incomes}
          incomeForm={data.incomeForm}
          editingIncomeId={data.editingIncomeId}
          editingExpenseId={data.editingExpenseId}
          expenseForm={data.expenseForm}
          categories={data.categories}
          cashboxInput={data.cashboxInput}
          onIncomeFormChange={data.handleIncomeFormChange}
          onAddIncome={data.handleAddIncome}
          onEditIncome={data.handleEditIncome}
          onSaveEditIncome={data.handleSaveEditIncome}
          onCancelEditIncome={data.handleCancelEditIncome}
          onRemoveIncome={data.handleRemoveIncome}
          onCashboxInputChange={data.handleCashboxInputChange}
          onSaveCashbox={data.handleSaveCashbox}
          onExpenseFieldChange={data.handleExpenseFieldChange}
          onAddExpense={data.handleAddExpense}
          onEditExpense={data.handleEditExpense}
          onSaveEditExpense={data.handleSaveEditExpense}
          onCancelEditExpense={data.handleCancelEditExpense}
          onRemoveExpense={data.handleRemoveExpense}
        />

        <ExpensesTable
          expenses={data.monthData.expenses}
          onRemoveExpense={data.handleRemoveExpense}
          onEditExpense={data.handleEditExpense}
          onSetInstallmentsPaid={data.handleSetInstallmentsPaid}
          onClearAllExpenses={data.handleClearAllExpenses}
        />
      </section>
    </Layout>
  )
}

export default App

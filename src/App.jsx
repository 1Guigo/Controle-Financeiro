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

      <SummaryCards
        income={data.income}
        investments={data.totalInvestments}
        cashbox={data.cashbox}
        totalExpenses={data.totalExpenses}
        balance={data.balance}
        calculatedBalance={data.calculatedBalance}
        carryOver={data.carryOver}
      />

      <ChartsSection categoryData={data.categoryData} />

      <section className="mt-10 grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_1.3fr]">
        <ExpenseFormsPanel
          incomes={data.incomes}
          incomeForm={data.incomeForm}
          editingIncomeId={data.editingIncomeId}
          editingExpenseId={data.editingExpenseId}
          expenseForm={data.expenseForm}
          categories={data.categories}
          investmentForm={data.investmentForm}
          investmentsList={data.monthData.investments}
          cashboxInput={data.cashboxInput}
          onIncomeFormChange={data.handleIncomeFormChange}
          onAddIncome={data.handleAddIncome}
          onEditIncome={data.handleEditIncome}
          onSaveEditIncome={data.handleSaveEditIncome}
          onCancelEditIncome={data.handleCancelEditIncome}
          onRemoveIncome={data.handleRemoveIncome}
          onInvestmentFormChange={data.handleInvestmentFormChange}
          onAddInvestment={data.handleAddInvestment}
          onRemoveInvestment={data.handleRemoveInvestment}
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

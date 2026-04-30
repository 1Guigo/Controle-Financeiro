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
        onAddExpenseClick={scrollToExpenseForm}
      />

      <SummaryCards
        income={data.income}
        investments={data.totalInvestments}
        cashbox={data.cashbox}
        totalExpenses={data.totalExpenses}
        balance={data.balance}
      />

      <ChartsSection categoryData={data.categoryData} usageData={data.usageData} />

      <section className="mt-10 grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_1.3fr]">
        <ExpenseFormsPanel
          incomeInputMid={data.incomeInputMid}
          incomeInputEnd={data.incomeInputEnd}
          incomeDateInputMid={data.incomeDateInputMid}
          incomeDateInputEnd={data.incomeDateInputEnd}
          investmentForm={data.investmentForm}
          investmentsList={data.monthData.investments}
          cashboxInput={data.cashboxInput}
          expenseForm={data.expenseForm}
          categories={data.categories}
          onIncomeInputChange={data.handleIncomeInputChange}
          onIncomeDateChange={data.handleIncomeDateChange}
          onInvestmentFormChange={data.handleInvestmentFormChange}
          onAddInvestment={data.handleAddInvestment}
          onRemoveInvestment={data.handleRemoveInvestment}
          onCashboxInputChange={data.handleCashboxInputChange}
          onSaveCashbox={data.handleSaveCashbox}
          onIncomeSubmit={data.handleSaveIncome}
          onIncomeClear={data.handleClearIncome}
          onExpenseFieldChange={data.handleExpenseFieldChange}
          onExpenseSubmit={data.handleAddExpense}
        />

        <ExpensesTable
          expenses={data.monthData.expenses}
          onRemoveExpense={data.handleRemoveExpense}
          onSetInstallmentsPaid={data.handleSetInstallmentsPaid}
          onClearAllExpenses={data.handleClearAllExpenses}
        />
      </section>
    </Layout>
  )
}

export default App

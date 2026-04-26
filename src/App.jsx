import ChartsSection from './components/ChartsSection'
import DashboardHeader from './components/DashboardHeader'
import ExpenseFormsPanel from './components/ExpenseFormsPanel'
import ExpensesTable from './components/ExpensesTable'
import MonthSelect from './components/MonthSelect'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import { useFinanceDashboard } from './hooks/useFinanceDashboard'

function App() {
  const data = useFinanceDashboard()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar
          months={data.months}
          selectedMonth={data.selectedMonth}
          onSelectMonth={data.setSelectedMonth}
        />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <DashboardHeader monthLabel={data.monthLabel} balance={data.balance} />

          <MonthSelect
            months={data.months}
            selectedMonth={data.selectedMonth}
            onSelectMonth={data.setSelectedMonth}
          />

          <SummaryCards
            income={data.income}
            totalExpenses={data.totalExpenses}
            balance={data.balance}
          />

          <ChartsSection categoryData={data.categoryData} usageData={data.usageData} />

          <section className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_1.4fr]">
            <ExpenseFormsPanel
              incomeInput={data.incomeInput}
              expenseForm={data.expenseForm}
              categories={data.categories}
              onIncomeInputChange={data.handleIncomeInputChange}
              onIncomeSubmit={data.handleSaveIncome}
              onExpenseFieldChange={data.handleExpenseFieldChange}
              onExpenseSubmit={data.handleAddExpense}
            />

            <ExpensesTable
              expenses={data.monthData.expenses}
              onRemoveExpense={data.handleRemoveExpense}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App

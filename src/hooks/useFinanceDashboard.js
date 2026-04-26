import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES, DEFAULT_MONTH_DATA } from '../constants/finance'
import {
  calculateTotals,
  clampToMoney,
  groupExpensesByCategory,
} from '../lib/finance'
import { MONTHS } from '../lib/months'
import { loadAppState, saveAppState } from '../lib/storage'

function getInitialFinanceByMonth() {
  return MONTHS.reduce((acc, month) => {
    acc[month.key] = { ...DEFAULT_MONTH_DATA }
    return acc
  }, {})
}

function mergeSavedState(savedState) {
  const base = getInitialFinanceByMonth()
  if (!savedState || typeof savedState !== 'object') return base

  for (const month of MONTHS) {
    const data = savedState[month.key]
    if (!data || typeof data !== 'object') continue
    base[month.key] = {
      income: clampToMoney(data.income ?? 0),
      expenses: Array.isArray(data.expenses)
        ? data.expenses
            .filter((expense) => expense && typeof expense === 'object')
            .map((expense) => ({
              id: String(expense.id || crypto.randomUUID()),
              description: String(expense.description || 'Despesa'),
              category: String(expense.category || 'Outros'),
              amount: clampToMoney(expense.amount || 0),
              date: String(expense.date || ''),
            }))
        : [],
    }
  }

  return base
}

function getIncomeDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    const value = financeByMonth[month.key]?.income ?? 0
    acc[month.key] = value ? String(value) : ''
    return acc
  }, {})
}

export function useFinanceDashboard() {
  const currentMonthKey = String(new Date().getMonth() + 1).padStart(2, '0')
  const initialFinance = useMemo(() => mergeSavedState(loadAppState()), [])

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [financeByMonth, setFinanceByMonth] = useState(initialFinance)
  const [incomeInputByMonth, setIncomeInputByMonth] = useState(() =>
    getIncomeDrafts(initialFinance),
  )
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: DEFAULT_CATEGORIES[0],
    amount: '',
    date: '',
  })

  const monthLabel = useMemo(
    () => MONTHS.find((m) => m.key === selectedMonth)?.label || 'Mês',
    [selectedMonth],
  )

  const monthData = financeByMonth[selectedMonth] || DEFAULT_MONTH_DATA
  const incomeInput = incomeInputByMonth[selectedMonth] ?? ''
  const { income, totalExpenses, balance } = useMemo(
    () => calculateTotals(monthData),
    [monthData],
  )

  const categoryData = useMemo(
    () => groupExpensesByCategory(monthData.expenses),
    [monthData.expenses],
  )

  const usageData = useMemo(() => {
    const spent = totalExpenses
    const remaining = Math.max(income - totalExpenses, 0)
    if (spent === 0 && remaining === 0) {
      return [
        { name: 'Gasto', value: 0 },
        { name: 'Sobra', value: 0 },
      ]
    }
    return [
      { name: 'Gasto', value: clampToMoney(spent) },
      { name: 'Sobra', value: clampToMoney(remaining) },
    ]
  }, [income, totalExpenses])

  useEffect(() => {
    saveAppState(financeByMonth)
  }, [financeByMonth])

  function updateSelectedMonthData(updater) {
    setFinanceByMonth((prev) => ({
      ...prev,
      [selectedMonth]: updater(prev[selectedMonth] || DEFAULT_MONTH_DATA),
    }))
  }

  function handleIncomeInputChange(value) {
    setIncomeInputByMonth((prev) => ({ ...prev, [selectedMonth]: value }))
  }

  function handleSaveIncome() {
    const value = clampToMoney(incomeInput)
    updateSelectedMonthData((current) => ({ ...current, income: value }))
    setIncomeInputByMonth((prev) => ({
      ...prev,
      [selectedMonth]: value ? String(value) : '',
    }))
  }

  function handleExpenseFieldChange(name, value) {
    setExpenseForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleAddExpense() {
    if (!expenseForm.description.trim() || !expenseForm.amount) return
    const amount = clampToMoney(expenseForm.amount)
    if (amount <= 0) return

    const newExpense = {
      id: crypto.randomUUID(),
      description: expenseForm.description.trim(),
      category: expenseForm.category,
      amount,
      date: expenseForm.date,
    }

    updateSelectedMonthData((current) => ({
      ...current,
      expenses: [newExpense, ...(current.expenses || [])],
    }))

    setExpenseForm({
      description: '',
      category: DEFAULT_CATEGORIES[0],
      amount: '',
      date: '',
    })
  }

  function handleRemoveExpense(id) {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: (current.expenses || []).filter((expense) => expense.id !== id),
    }))
  }

  return {
    months: MONTHS,
    categories: DEFAULT_CATEGORIES,
    selectedMonth,
    setSelectedMonth,
    monthLabel,
    monthData,
    incomeInput,
    expenseForm,
    income,
    totalExpenses,
    balance,
    categoryData,
    usageData,
    handleIncomeInputChange,
    handleSaveIncome,
    handleExpenseFieldChange,
    handleAddExpense,
    handleRemoveExpense,
  }
}


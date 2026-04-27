import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, DEFAULT_MONTH_DATA } from '../constants/finance'
import {
  calculateTotals,
  clampToMoney,
  groupExpensesByCategory,
} from '../lib/finance'
import { getCategoryColor, getCategoryNames } from '../lib/categories'
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
            .map((expense) => {
              const installmentsTotal = Math.max(1, Number(expense.installmentsTotal || 1))
              const installmentsPaid = Math.min(
                Math.max(0, Number(expense.installmentsPaid || 0)),
                installmentsTotal,
              )
              return {
                id: String(expense.id || crypto.randomUUID()),
                description: String(expense.description || 'Despesa'),
                category: String(expense.category || 'Outros'),
                amount: clampToMoney(expense.amount || 0),
                date: String(expense.date || ''),
                installmentsTotal,
                installmentsPaid,
              }
            })
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
    category: getCategoryNames()[0],
    amount: '',
    date: '',
    isInstallment: false,
    installmentsTotal: 2,
    installmentsPaid: 0,
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
    () => groupExpensesByCategory(monthData.expenses, getCategoryColor),
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

    const isInstallment = Boolean(expenseForm.isInstallment)
    const installmentsTotal = isInstallment ? Math.max(2, Number(expenseForm.installmentsTotal || 2)) : 1
    const installmentsPaidRaw = isInstallment ? Number(expenseForm.installmentsPaid || 0) : 0
    const installmentsPaid = isInstallment
      ? Math.min(Math.max(0, installmentsPaidRaw), installmentsTotal)
      : 0

    const newExpense = {
      id: crypto.randomUUID(),
      description: expenseForm.description.trim(),
      category: expenseForm.category,
      amount,
      date: expenseForm.date,
      installmentsTotal,
      installmentsPaid,
    }

    updateSelectedMonthData((current) => ({
      ...current,
      expenses: [newExpense, ...(current.expenses || [])],
    }))

    setExpenseForm({
      description: '',
      category: getCategoryNames()[0],
      amount: '',
      date: '',
      isInstallment: false,
      installmentsTotal: 2,
      installmentsPaid: 0,
    })
  }

  function handleRemoveExpense(id) {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: (current.expenses || []).filter((expense) => expense.id !== id),
    }))
  }

  function handleSetInstallmentsPaid(id, nextPaid) {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: (current.expenses || []).map((expense) => {
        if (expense.id !== id) return expense
        const total = Math.max(1, Number(expense.installmentsTotal || 1))
        const paid = Math.min(Math.max(0, Number(nextPaid || 0)), total)
        return { ...expense, installmentsTotal: total, installmentsPaid: paid }
      }),
    }))
  }

  return {
    months: MONTHS,
    categories: getCategoryNames(),
    categoryMeta: CATEGORIES,
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
    handleSetInstallmentsPaid,
  }
}


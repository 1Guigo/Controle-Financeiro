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
    
    // Migração de investimentos antigos (número para array)
    let investments = []
    if (Array.isArray(data.investments)) {
      investments = data.investments.map((inv) => ({
        id: String(inv.id || crypto.randomUUID()),
        nome: String(inv.nome || inv.name || ''),
        valor: clampToMoney(inv.valor || inv.amount || 0),
      }))
    } else if (typeof data.investments === 'number' && data.investments > 0) {
      investments = [{ id: crypto.randomUUID(), nome: 'Investimento', valor: clampToMoney(data.investments) }]
    }
    
    base[month.key] = {
      incomeMidMonth: clampToMoney(data.incomeMidMonth ?? data.income ?? 0),
      incomeMidMonthDate: String(data.incomeMidMonthDate || data.incomeDate || ''),
      incomeEndMonth: clampToMoney(data.incomeEndMonth ?? 0),
      incomeEndMonthDate: String(data.incomeEndMonthDate || ''),
      investments,
      cashbox: clampToMoney(data.cashbox ?? 0),
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
                isFixed: Boolean(expense.isFixed || false),
              }
            })
        : [],
    }
  }

  return base
}

function getIncomeDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    const midMonth = financeByMonth[month.key]?.incomeMidMonth ?? 0
    const endMonth = financeByMonth[month.key]?.incomeEndMonth ?? 0
    acc[`${month.key}_mid`] = midMonth ? String(midMonth) : ''
    acc[`${month.key}_end`] = endMonth ? String(endMonth) : ''
    return acc
  }, {})
}

function getIncomeDateDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    acc[`${month.key}_mid`] = String(financeByMonth[month.key]?.incomeMidMonthDate || '')
    acc[`${month.key}_end`] = String(financeByMonth[month.key]?.incomeEndMonthDate || '')
    return acc
  }, {})
}

function getInvestmentsDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    acc[month.key] = {
      name: '',
      valor: '',
    }
    return acc
  }, {})
}

function getCashboxDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    const cashbox = financeByMonth[month.key]?.cashbox ?? 0
    acc[month.key] = cashbox ? String(cashbox) : ''
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
  const [incomeDateByMonth, setIncomeDateByMonth] = useState(() =>
    getIncomeDateDrafts(initialFinance),
  )
  const [investmentFormByMonth, setInvestmentFormByMonth] = useState(() =>
    getInvestmentsDrafts(initialFinance),
  )
  const [cashboxInputByMonth, setCashboxInputByMonth] = useState(() =>
    getCashboxDrafts(initialFinance),
  )
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: getCategoryNames()[0],
    amount: '',
    date: '',
    isInstallment: false,
    installmentsTotal: 2,
    installmentsPaid: 0,
    isFixed: false,
  })

  const monthLabel = useMemo(
    () => MONTHS.find((m) => m.key === selectedMonth)?.label || 'Mês',
    [selectedMonth],
  )

  const monthData = financeByMonth[selectedMonth] || DEFAULT_MONTH_DATA
  const incomeInputMid = incomeInputByMonth[`${selectedMonth}_mid`] ?? ''
  const incomeInputEnd = incomeInputByMonth[`${selectedMonth}_end`] ?? ''
  const incomeDateInputMid = incomeDateByMonth[`${selectedMonth}_mid`] ?? ''
  const incomeDateInputEnd = incomeDateByMonth[`${selectedMonth}_end`] ?? ''
  const investmentForm = investmentFormByMonth[selectedMonth] ?? { name: '', valor: '' }
  const cashboxInput = cashboxInputByMonth[selectedMonth] ?? ''
  const { income, investments: totalInvestments, cashbox, totalExpenses, balance } = useMemo(
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

  function handleIncomeInputChange(type, value) {
    setIncomeInputByMonth((prev) => ({ ...prev, [`${selectedMonth}_${type}`]: value }))
  }

  function handleSaveIncome() {
    const midMonth = clampToMoney(incomeInputMid)
    const endMonth = clampToMoney(incomeInputEnd)
    updateSelectedMonthData((current) => ({
      ...current,
      incomeMidMonth: midMonth,
      incomeMidMonthDate: incomeDateInputMid,
      incomeEndMonth: endMonth,
      incomeEndMonthDate: incomeDateInputEnd,
    }))
    setIncomeInputByMonth((prev) => ({
      ...prev,
      [`${selectedMonth}_mid`]: midMonth ? String(midMonth) : '',
      [`${selectedMonth}_end`]: endMonth ? String(endMonth) : '',
    }))
  }

  function handleIncomeDateChange(type, value) {
    setIncomeDateByMonth((prev) => ({ ...prev, [`${selectedMonth}_${type}`]: value }))
  }

  function handleClearIncome() {
    updateSelectedMonthData((current) => ({
      ...current,
      incomeMidMonth: 0,
      incomeMidMonthDate: '',
      incomeEndMonth: 0,
      incomeEndMonthDate: '',
    }))
    setIncomeInputByMonth((prev) => ({
      ...prev,
      [`${selectedMonth}_mid`]: '',
      [`${selectedMonth}_end`]: '',
    }))
    setIncomeDateByMonth((prev) => ({
      ...prev,
      [`${selectedMonth}_mid`]: '',
      [`${selectedMonth}_end`]: '',
    }))
  }

  function handleInvestmentFormChange(field, value) {
    setInvestmentFormByMonth((prev) => ({
      ...prev,
      [selectedMonth]: { ...prev[selectedMonth], [field]: value },
    }))
  }

  function handleAddInvestment() {
    const nome = investmentForm.name?.trim()
    const valor = clampToMoney(investmentForm.valor)
    if (!nome || valor <= 0) return

    const newInvestment = {
      id: crypto.randomUUID(),
      nome,
      valor,
    }

    updateSelectedMonthData((current) => ({
      ...current,
      investments: [...(current.investments || []), newInvestment],
    }))

    setInvestmentFormByMonth((prev) => ({
      ...prev,
      [selectedMonth]: { name: '', valor: '' },
    }))
  }

  function handleRemoveInvestment(id) {
    updateSelectedMonthData((current) => ({
      ...current,
      investments: (current.investments || []).filter((inv) => inv.id !== id),
    }))
  }

  function handleCashboxInputChange(value) {
    setCashboxInputByMonth((prev) => ({ ...prev, [selectedMonth]: value }))
  }

  function handleSaveCashbox() {
    const cashbox = clampToMoney(cashboxInput)
    updateSelectedMonthData((current) => ({
      ...current,
      cashbox,
    }))
    setCashboxInputByMonth((prev) => ({
      ...prev,
      [selectedMonth]: cashbox ? String(cashbox) : '',
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
      isFixed: Boolean(expenseForm.isFixed),
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
      isFixed: false,
    })
  }

  function handleRemoveExpense(id) {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: (current.expenses || []).filter((expense) => expense.id !== id),
    }))
  }

  function handleClearAllExpenses() {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: [],
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
    incomeInputMid,
    incomeInputEnd,
    expenseForm,
    incomeDateInputMid,
    incomeDateInputEnd,
    investmentForm,
    cashboxInput,
    income,
    totalInvestments,
    cashbox,
    totalExpenses,
    balance,
    categoryData,
    usageData,
    handleIncomeInputChange,
    handleIncomeDateChange,
    handleSaveIncome,
    handleClearIncome,
    handleInvestmentFormChange,
    handleAddInvestment,
    handleRemoveInvestment,
    handleCashboxInputChange,
    handleSaveCashbox,
    handleExpenseFieldChange,
    handleAddExpense,
    handleRemoveExpense,
    handleClearAllExpenses,
    handleSetInstallmentsPaid,
  }
}


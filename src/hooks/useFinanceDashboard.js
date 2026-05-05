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

function buildMonthOptions(year = new Date().getFullYear()) {
  return MONTHS.map((month) => ({
    key: `${year}-${month.key}`,
    label: month.label,
  }))
}

function normalizeMonthKey(key, year = new Date().getFullYear()) {
  if (typeof key !== 'string') return ''
  if (/^\d{4}-\d{2}$/.test(key)) return key
  if (/^\d{2}$/.test(key)) return `${year}-${key}`
  return key
}

function getPreviousMonthKey(yearMonth) {
  const [year, month] = String(yearMonth).split('-').map(Number)
  if (!Number.isFinite(year) || !Number.isFinite(month)) return yearMonth
  const date = new Date(year, month - 1, 1)
  date.setMonth(date.getMonth() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getInitialFinanceByMonth(monthOptions) {
  return monthOptions.reduce((acc, month) => {
    acc[month.key] = { ...DEFAULT_MONTH_DATA }
    return acc
  }, {})
}

function migrateMonthData(data) {
  if (!data || typeof data !== 'object') return { ...DEFAULT_MONTH_DATA }

  // Mantém investimentos para compatibilidade, mas não os usa mais
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

  const incomes = []
  const midIncome = clampToMoney(data.incomeMidMonth ?? data.income ?? 0)
  if (midIncome > 0) {
    incomes.push({
      id: crypto.randomUUID(),
      name: 'Salário Meio do Mês',
      amount: midIncome,
      type: 'salário',
      date: String(data.incomeMidMonthDate || data.incomeDate || ''),
    })
  }
  const endIncome = clampToMoney(data.incomeEndMonth ?? 0)
  if (endIncome > 0) {
    incomes.push({
      id: crypto.randomUUID(),
      name: 'Salário Final do Mês',
      amount: endIncome,
      type: 'salário',
      date: String(data.incomeEndMonthDate || ''),
    })
  }

  return {
    incomes,
    investments, // Mantém para compatibilidade
    cashbox: clampToMoney(data.cashbox ?? 0),
    manualBalance: data.manualBalance !== undefined ? clampToMoney(data.manualBalance) : null,
    carryOver: clampToMoney(data.carryOver ?? 0),
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

function mergeSavedState(savedState, monthOptions) {
  const currentYear = new Date().getFullYear()
  const financeByMonth = {}

  if (savedState && typeof savedState === 'object') {
    for (const [rawKey, monthData] of Object.entries(savedState)) {
      if (!monthData || typeof monthData !== 'object') continue
      const key = normalizeMonthKey(rawKey, currentYear)
      if (!key) continue
      financeByMonth[key] = migrateMonthData(monthData)
    }
  }

  const base = getInitialFinanceByMonth(monthOptions)
  return Object.keys({ ...base, ...financeByMonth }).reduce((acc, key) => {
    acc[key] = financeByMonth[key] || base[key] || { ...DEFAULT_MONTH_DATA }
    return acc
  }, {})
}

function getCashboxDrafts(financeByMonth, monthOptions) {
  return monthOptions.reduce((acc, month) => {
    const cashbox = financeByMonth[month.key]?.cashbox ?? 0
    acc[month.key] = cashbox ? String(cashbox) : ''
    return acc
  }, {})
}

function getManualBalanceDrafts(financeByMonth, monthOptions) {
  return monthOptions.reduce((acc, month) => {
    const manualBalance = financeByMonth[month.key]?.manualBalance
    acc[month.key] = manualBalance !== null && manualBalance !== undefined ? String(manualBalance) : ''
    return acc
  }, {})
}

export function useFinanceDashboard() {
  const currentYear = new Date().getFullYear()
  const monthOptions = useMemo(() => buildMonthOptions(currentYear), [currentYear])
  const currentMonthKey = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const initialFinance = useMemo(() => mergeSavedState(loadAppState(), monthOptions), [monthOptions])

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [financeByMonth, setFinanceByMonth] = useState(initialFinance)
  const [cashboxInputByMonth, setCashboxInputByMonth] = useState(() =>
    getCashboxDrafts(initialFinance, monthOptions),
  )
  const [manualBalanceInputByMonth, setManualBalanceInputByMonth] = useState(() =>
    getManualBalanceDrafts(initialFinance, monthOptions),
  )
  const [incomeForm, setIncomeForm] = useState({
    name: '',
    amount: '',
    type: 'salário',
    date: '',
  })
  const [editingIncomeId, setEditingIncomeId] = useState(null)
  const [editingExpenseId, setEditingExpenseId] = useState(null)
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
  const [isDirty, setIsDirty] = useState(false)

  const monthLabel = useMemo(
    () => monthOptions.find((m) => m.key === selectedMonth)?.label || 'Mês',
    [selectedMonth, monthOptions],
  )

  const monthData = financeByMonth[selectedMonth] || DEFAULT_MONTH_DATA
  const incomes = monthData.incomes || []
  const cashboxInput = cashboxInputByMonth[selectedMonth] ?? ''
  const manualBalanceInput = manualBalanceInputByMonth[selectedMonth] ?? ''
  const { income, cashbox, totalExpenses, balance, calculatedBalance, carryOver } = useMemo(
    () => calculateTotals(monthData),
    [monthData],
  )

  const categoryData = useMemo(
    () => groupExpensesByCategory(monthData.expenses, getCategoryColor),
    [monthData.expenses],
  )

  useEffect(() => {
    // Transferir saldo do mês anterior como carryOver para o mês atual
    const prevMonthKey = getPreviousMonthKey(selectedMonth)
    const prevMonthData = financeByMonth[prevMonthKey]
    if (prevMonthData) {
      const prevTotals = calculateTotals(prevMonthData)
      const prevBalance = prevTotals.balance
      // Só transferir se positivo e se o mês atual ainda não tem carryOver definido
      if (prevBalance > 0 && (!monthData.carryOver || monthData.carryOver === 0)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFinanceByMonth((prev) => ({
          ...prev,
          [selectedMonth]: {
            ...prev[selectedMonth],
            carryOver: prevBalance,
          },
        }))
      }
    }
  }, [selectedMonth, financeByMonth, monthData.carryOver])

  function updateSelectedMonthData(updater) {
    setFinanceByMonth((prev) => ({
      ...prev,
      [selectedMonth]: updater(prev[selectedMonth] || DEFAULT_MONTH_DATA),
    }))
  }

  function handleIncomeFormChange(field, value) {
    setIncomeForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleAddIncome() {
    if (!incomeForm.name.trim() || !incomeForm.amount) return
    const amount = clampToMoney(incomeForm.amount)
    if (amount <= 0) return

    const newIncome = {
      id: crypto.randomUUID(),
      name: incomeForm.name.trim(),
      amount,
      type: incomeForm.type,
      date: incomeForm.date,
    }

    updateSelectedMonthData((current) => ({
      ...current,
      incomes: [...(current.incomes || []), newIncome],
    }))

    setIsDirty(true)

    setIncomeForm({
      name: '',
      amount: '',
      type: 'salário',
      date: '',
    })
  }

  function handleEditIncome(id) {
    const income = incomes.find((inc) => inc.id === id)
    if (income) {
      setIncomeForm({
        name: income.name,
        amount: String(income.amount),
        type: income.type,
        date: income.date,
      })
      setEditingIncomeId(id)
    }
  }

  function handleSaveEditIncome() {
    if (!editingIncomeId) return
    const amount = clampToMoney(incomeForm.amount)
    if (amount <= 0) return

    updateSelectedMonthData((current) => ({
      ...current,
      incomes: (current.incomes || []).map((inc) =>
        inc.id === editingIncomeId
          ? {
              ...inc,
              name: incomeForm.name.trim(),
              amount,
              type: incomeForm.type,
              date: incomeForm.date,
            }
          : inc
      ),
    }))

    setIsDirty(true)

    setIncomeForm({
      name: '',
      amount: '',
      type: 'salário',
      date: '',
    })
    setEditingIncomeId(null)
  }

  function handleCancelEditIncome() {
    setIncomeForm({
      name: '',
      amount: '',
      type: 'salário',
      date: '',
    })
    setEditingIncomeId(null)
  }

  function handleRemoveIncome(id) {
    updateSelectedMonthData((current) => ({
      ...current,
      incomes: (current.incomes || []).filter((inc) => inc.id !== id),
    }))
    setIsDirty(true)
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
    setIsDirty(true)
  }

  function handleManualBalanceInputChange(value) {
    setManualBalanceInputByMonth((prev) => ({ ...prev, [selectedMonth]: value }))
  }

  function handleSaveManualBalance() {
    const manualBalance = manualBalanceInput ? clampToMoney(manualBalanceInput) : null
    updateSelectedMonthData((current) => ({
      ...current,
      manualBalance,
    }))
    setManualBalanceInputByMonth((prev) => ({
      ...prev,
      [selectedMonth]: manualBalance !== null ? String(manualBalance) : '',
    }))
    setIsDirty(true)
  }

  function handleClearManualBalance() {
    updateSelectedMonthData((current) => ({
      ...current,
      manualBalance: null,
    }))
    setManualBalanceInputByMonth((prev) => ({
      ...prev,
      [selectedMonth]: '',
    }))
    setIsDirty(true)
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

    setIsDirty(true)

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
    setIsDirty(true)
  }

  function handleEditExpense(id) {
    const expense = monthData.expenses.find((exp) => exp.id === id)
    if (expense) {
      setExpenseForm({
        description: expense.description,
        category: expense.category,
        amount: String(expense.amount),
        date: expense.date,
        isInstallment: expense.installmentsTotal > 1,
        installmentsTotal: expense.installmentsTotal,
        installmentsPaid: expense.installmentsPaid,
        isFixed: expense.isFixed,
      })
      setEditingExpenseId(id)
    }
  }

  function handleSaveEditExpense() {
    if (!editingExpenseId) return
    const amount = clampToMoney(expenseForm.amount)
    if (amount <= 0) return

    const isInstallment = Boolean(expenseForm.isInstallment)
    const installmentsTotal = isInstallment ? Math.max(2, Number(expenseForm.installmentsTotal || 2)) : 1
    const installmentsPaidRaw = isInstallment ? Number(expenseForm.installmentsPaid || 0) : 0
    const installmentsPaid = isInstallment
      ? Math.min(Math.max(0, installmentsPaidRaw), installmentsTotal)
      : 0

    updateSelectedMonthData((current) => ({
      ...current,
      expenses: (current.expenses || []).map((exp) =>
        exp.id === editingExpenseId
          ? {
              ...exp,
              description: expenseForm.description.trim(),
              category: expenseForm.category,
              amount,
              date: expenseForm.date,
              isInstallment,
              installmentsTotal,
              installmentsPaid,
              isFixed: Boolean(expenseForm.isFixed),
            }
          : exp
      ),
    }))

    setIsDirty(true)

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
    setEditingExpenseId(null)
  }

  function handleCancelEditExpense() {
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
    setEditingExpenseId(null)
  }

  function handleClearAllExpenses() {
    updateSelectedMonthData((current) => ({
      ...current,
      expenses: [],
    }))
    setIsDirty(true)
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
    setIsDirty(true)
  }

  function handleSave() {
    saveAppState(financeByMonth)
    setIsDirty(false)
  }

  return {
    months: monthOptions,
    categories: getCategoryNames(),
    categoryMeta: CATEGORIES,
    selectedMonth,
    setSelectedMonth,
    monthLabel,
    monthData,
    incomes,
    incomeForm,
    editingIncomeId,
    editingExpenseId,
    expenseForm,
    cashboxInput,
    manualBalanceInput,
    income,
    cashbox,
    totalExpenses,
    balance,
    calculatedBalance,
    carryOver,
    categoryData,
    handleIncomeFormChange,
    handleAddIncome,
    handleEditIncome,
    handleSaveEditIncome,
    handleCancelEditIncome,
    handleRemoveIncome,
    handleCashboxInputChange,
    handleSaveCashbox,
    handleManualBalanceInputChange,
    handleSaveManualBalance,
    handleClearManualBalance,
    handleExpenseFieldChange,
    handleAddExpense,
    handleEditExpense,
    handleSaveEditExpense,
    handleCancelEditExpense,
    handleRemoveExpense,
    handleClearAllExpenses,
    handleSetInstallmentsPaid,
    isDirty,
    handleSave,
  }
}


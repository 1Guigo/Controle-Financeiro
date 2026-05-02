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
    
    // Migração de incomes
    let incomes = []
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
    
    base[month.key] = {
      incomes,
      investments,
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

  return base
}

function getInvestmentsDrafts() {
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

function getManualBalanceDrafts(financeByMonth) {
  return MONTHS.reduce((acc, month) => {
    const manualBalance = financeByMonth[month.key]?.manualBalance
    acc[month.key] = manualBalance !== null && manualBalance !== undefined ? String(manualBalance) : ''
    return acc
  }, {})
}

export function useFinanceDashboard() {
  const currentMonthKey = String(new Date().getMonth() + 1).padStart(2, '0')
  const initialFinance = useMemo(() => mergeSavedState(loadAppState()), [])

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [financeByMonth, setFinanceByMonth] = useState(initialFinance)
  const [investmentFormByMonth, setInvestmentFormByMonth] = useState(() =>
    getInvestmentsDrafts(initialFinance),
  )
  const [cashboxInputByMonth, setCashboxInputByMonth] = useState(() =>
    getCashboxDrafts(initialFinance),
  )
  const [manualBalanceInputByMonth, setManualBalanceInputByMonth] = useState(() =>
    getManualBalanceDrafts(initialFinance),
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

  const monthLabel = useMemo(
    () => MONTHS.find((m) => m.key === selectedMonth)?.label || 'Mês',
    [selectedMonth],
  )

  const monthData = financeByMonth[selectedMonth] || DEFAULT_MONTH_DATA
  const incomes = monthData.incomes || []
  const investmentForm = investmentFormByMonth[selectedMonth] ?? { name: '', valor: '' }
  const cashboxInput = cashboxInputByMonth[selectedMonth] ?? ''
  const manualBalanceInput = manualBalanceInputByMonth[selectedMonth] ?? ''
  const { income, investments: totalInvestments, cashbox, totalExpenses, balance, calculatedBalance, carryOver } = useMemo(
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
    // Transferir saldo do mês anterior como carryOver para o mês atual
    const prevMonthKey = selectedMonth === '01' ? '12' : String(Number(selectedMonth) - 1).padStart(2, '0')
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
  }, [selectedMonth, financeByMonth])

  useEffect(() => {
    saveAppState(financeByMonth)
  }, [financeByMonth])

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
    incomes,
    incomeForm,
    editingIncomeId,
    editingExpenseId,
    expenseForm,
    investmentForm,
    cashboxInput,
    manualBalanceInput,
    income,
    totalInvestments,
    cashbox,
    totalExpenses,
    balance,
    calculatedBalance,
    carryOver,
    categoryData,
    usageData,
    handleIncomeFormChange,
    handleAddIncome,
    handleEditIncome,
    handleSaveEditIncome,
    handleCancelEditIncome,
    handleRemoveIncome,
    handleInvestmentFormChange,
    handleAddInvestment,
    handleRemoveInvestment,
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
  }
}


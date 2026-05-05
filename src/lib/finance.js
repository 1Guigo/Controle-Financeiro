export function formatCurrencyBRL(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(number) ? number : 0)
}

export function clampToMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100) / 100
}

export function calculateTotals(monthData) {
  const incomes = Array.isArray(monthData?.incomes) ? monthData.incomes : []
  
  // Receitas: salário, vale, outros (removido finanças de investimentos)
  const income = clampToMoney(
    incomes
      .filter((inc) => !['caixinha'].includes(inc.type)) // removido 'finanças'
      .reduce((acc, inc) => acc + clampToMoney(inc.amount || 0), 0),
  )
  
  // Caixinha: caixinha + cashbox existente
  const cashboxFromIncomes = clampToMoney(
    incomes
      .filter((inc) => inc.type === 'caixinha')
      .reduce((acc, inc) => acc + clampToMoney(inc.amount || 0), 0),
  )
  const cashbox = clampToMoney(cashboxFromIncomes + clampToMoney(monthData?.cashbox ?? 0))
  
  const expenses = Array.isArray(monthData?.expenses) ? monthData.expenses : []
  const totalExpenses = clampToMoney(
    expenses.reduce((acc, e) => acc + clampToMoney(e.amount), 0),
  )
  
  const carryOver = clampToMoney(monthData?.carryOver ?? 0)
  const calculatedBalance = clampToMoney(carryOver + income - totalExpenses - cashbox)
  const manualAdjustment = monthData?.manualBalance !== null && monthData?.manualBalance !== undefined
    ? clampToMoney(monthData.manualBalance)
    : 0
  const balance = clampToMoney(calculatedBalance + manualAdjustment)
  return { income, cashbox, totalExpenses, balance, calculatedBalance, carryOver }
}

export function groupExpensesByCategory(expenses, getColor) {
  const list = Array.isArray(expenses) ? expenses : []
  const map = new Map()

  for (const e of list) {
    const category = String(e.category || 'Outros')
    const amount = clampToMoney(e.amount)
    map.set(category, (map.get(category) || 0) + amount)
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({
      name,
      value: clampToMoney(value),
      color: typeof getColor === 'function' ? getColor(name) : undefined,
    }))
    .sort((a, b) => b.value - a.value)
}


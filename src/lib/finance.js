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
  const incomeMidMonth = clampToMoney(monthData?.incomeMidMonth ?? 0)
  const incomeEndMonth = clampToMoney(monthData?.incomeEndMonth ?? 0)
  const income = clampToMoney(incomeMidMonth + incomeEndMonth)
  
  const investmentsList = Array.isArray(monthData?.investments) ? monthData.investments : []
  const totalInvestments = clampToMoney(
    investmentsList.reduce((acc, inv) => acc + clampToMoney(inv.valor ?? inv.amount ?? 0), 0),
  )
  
  const cashbox = clampToMoney(monthData?.cashbox ?? 0)
  
  const expenses = Array.isArray(monthData?.expenses) ? monthData.expenses : []
  const totalExpenses = clampToMoney(
    expenses.reduce((acc, e) => acc + clampToMoney(e.amount), 0),
  )
  
  const balance = clampToMoney(income - totalExpenses - totalInvestments - cashbox)
  return { income, investments: totalInvestments, cashbox, totalExpenses, balance }
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


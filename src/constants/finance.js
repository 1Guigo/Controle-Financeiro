export const CATEGORIES = [
  { name: 'Moradia', color: '#60a5fa' }, // blue
  { name: 'Alimentação', color: '#34d399' }, // emerald
  { name: 'Transporte', color: '#fbbf24' }, // amber
  { name: 'Saúde', color: '#fb7185' }, // rose
  { name: 'Lazer', color: '#a78bfa' }, // violet
  { name: 'Educação', color: '#22d3ee' }, // cyan
  { name: 'Compras', color: '#f472b6' }, // pink
  { name: 'Outros', color: '#94a3b8' }, // slate
]

export const DEFAULT_MONTH_DATA = {
  incomes: [],
  investments: [],
  cashbox: 0,
  expenses: [],
  manualBalance: null, // null means use calculated balance
  carryOver: 0, // saldo transferido do mês anterior
}


import Card from './Card'
import { formatCurrencyBRL } from '../lib/finance'

function SummaryCards({ income, cashbox, totalExpenses, carryOver }) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        title="Receitas"
        value={formatCurrencyBRL(income)}
        tone="income"
        subtitle="Total de salários"
      />
      {carryOver > 0 && (
        <Card
          title="Saldo Transferido"
          value={formatCurrencyBRL(carryOver)}
          tone="income"
          subtitle="Do mês anterior"
        />
      )}
      <Card
        title="Despesas"
        value={formatCurrencyBRL(totalExpenses)}
        tone="expense"
        subtitle="Soma de todos os lançamentos"
      />
      <Card
        title="Caixinha"
        value={formatCurrencyBRL(cashbox)}
        tone="income"
        subtitle="Dinheiro guardado"
      />
    </section>
  )
}

export default SummaryCards


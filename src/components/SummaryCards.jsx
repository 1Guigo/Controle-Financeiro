import Card from './Card'
import { formatCurrencyBRL } from '../lib/finance'

function SummaryCards({ income, totalExpenses, balance }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card
        title="Receita"
        value={formatCurrencyBRL(income)}
        tone="income"
        subtitle="Valor definido para o mês"
      />
      <Card
        title="Despesas"
        value={formatCurrencyBRL(totalExpenses)}
        tone="expense"
        subtitle="Soma de todos os lançamentos"
      />
      <Card
        title="Saldo"
        value={formatCurrencyBRL(balance)}
        tone={balance >= 0 ? 'balancePositive' : 'balanceNegative'}
        subtitle={balance >= 0 ? 'Dentro do planejado' : 'Atenção ao orçamento'}
      />
    </section>
  )
}

export default SummaryCards


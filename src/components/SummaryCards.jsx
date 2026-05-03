import Card from './Card'
import { formatCurrencyBRL } from '../lib/finance'

function SummaryCards({ income, investments, cashbox, totalExpenses, balance, calculatedBalance, carryOver }) {
  const isManualBalance = balance !== calculatedBalance
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card
        title="Saldo atual"
        value={formatCurrencyBRL(balance)}
        tone={balance >= 0 ? 'balancePositive' : 'balanceNegative'}
        subtitle={isManualBalance ? 'Saldo manual definido' : (balance >= 0 ? 'Dentro do planejado' : 'Atenção ao orçamento')}
        compact
      />
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
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
        <div className="grid gap-5 sm:grid-cols-2">
          <Card
            title="Despesas"
            value={formatCurrencyBRL(totalExpenses)}
            tone="expense"
            subtitle="Soma de todos os lançamentos"
          />
          <Card
            title="Investimentos"
            value={formatCurrencyBRL(investments)}
            tone="income"
            subtitle="Valor alocado"
          />
          <Card
            title="Caixinha"
            value={formatCurrencyBRL(cashbox)}
            tone="income"
            subtitle="Dinheiro guardado"
          />
        </div>
      </div>
    </section>
  )
}

export default SummaryCards


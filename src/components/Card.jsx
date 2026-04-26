const toneClasses = {
  income: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  expense: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  balancePositive: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
  balanceNegative: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
}

function Card({ title, value, subtitle, tone = 'balancePositive' }) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-xl shadow-black/20 ${toneClasses[tone] || toneClasses.balancePositive}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide opacity-90">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm opacity-90">{subtitle}</p>
    </article>
  )
}

export default Card


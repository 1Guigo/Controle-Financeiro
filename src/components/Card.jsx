const toneClasses = {
  income: 'text-emerald-600',
  expense: 'text-rose-500',
  balancePositive: 'text-indigo-600',
  balanceNegative: 'text-amber-600',
}

function Card({ title, value, subtitle, tone = 'balancePositive', large = false, compact = false }) {
  return (
    <article
      className={`app-surface fade-up ${compact ? 'p-4' : 'p-6'} ${
        toneClasses[tone] || toneClasses.balancePositive
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p
        className={`mt-3 font-bold tracking-tight ${large ? 'text-4xl sm:text-[2.9rem]' : 'text-2xl sm:text-3xl'}`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
    </article>
  )
}

export default Card


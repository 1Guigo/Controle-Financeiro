function MonthSelect({ months, selectedMonth, onSelectMonth }) {
  return (
    <div className="mb-6 lg:hidden">
      <label className="mb-2 block text-sm font-medium text-slate-300">
        Selecione o mês
      </label>
      <select
        value={selectedMonth}
        onChange={(event) => onSelectMonth(event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
      >
        {months.map((month) => (
          <option key={month.key} value={month.key}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MonthSelect


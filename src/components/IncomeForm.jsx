function IncomeForm({
  incomeInput,
  incomeDateInput,
  onIncomeInputChange,
  onIncomeDateChange,
  onSubmit,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
      <label className="block text-sm font-medium text-slate-700">Receita do mês</label>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={incomeInput}
          onChange={(event) => onIncomeInputChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Ex: 5000"
        />
        <button
          type="submit"
          className="pressable rounded-xl bg-indigo-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          Salvar
        </button>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Data da entrada
        </label>
        <input
          type="date"
          value={incomeDateInput}
          onChange={(event) => onIncomeDateChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </form>
  )
}

export default IncomeForm


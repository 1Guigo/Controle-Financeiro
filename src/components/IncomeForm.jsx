function IncomeForm({
  incomeInputMid,
  incomeInputEnd,
  incomeDateInputMid,
  incomeDateInputEnd,
  investmentsInput,
  onIncomeInputChange,
  onIncomeDateChange,
  onInvestmentsInputChange,
  onSubmit,
  onClearIncome,
  onSubmitInvestments,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  function handleSubmitInvestments(event) {
    event.preventDefault()
    onSubmitInvestments()
  }

  function handleClearIncomeClick() {
    const confirmed = window.confirm('Deseja apagar a receita lançada deste mês?')
    if (!confirmed) return
    onClearIncome()
  }

  return (
    <div className="space-y-3.5">
      <form onSubmit={handleSubmit} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
        <label className="block text-sm font-medium text-slate-700">Receita do mês</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Salário - Dia 15
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={incomeInputMid}
              onChange={(event) => onIncomeInputChange('mid', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Ex: 2500"
            />
            <input
              type="date"
              value={incomeDateInputMid}
              onChange={(event) => onIncomeDateChange('mid', event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Salário - Fim do mês
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={incomeInputEnd}
              onChange={(event) => onIncomeInputChange('end', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Ex: 2500"
            />
            <input
              type="date"
              value={incomeDateInputEnd}
              onChange={(event) => onIncomeDateChange('end', event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="pressable rounded-xl bg-indigo-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={handleClearIncomeClick}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100"
          >
            Apagar
          </button>
        </div>
      </form>
      <form onSubmit={handleSubmitInvestments} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
        <label className="block text-sm font-medium text-slate-700">Investimentos</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={investmentsInput}
            onChange={(event) => onInvestmentsInputChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Valor de investimentos"
          />
          <button
            type="submit"
            className="pressable rounded-xl bg-indigo-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}

export default IncomeForm


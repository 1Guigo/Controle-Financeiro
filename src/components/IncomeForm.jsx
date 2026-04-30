function IncomeForm({
  incomeInputMid,
  incomeInputEnd,
  incomeDateInputMid,
  incomeDateInputEnd,
  investmentForm,
  investmentsList,
  cashboxInput,
  onIncomeInputChange,
  onIncomeDateChange,
  onInvestmentFormChange,
  onAddInvestment,
  onRemoveInvestment,
  onCashboxInputChange,
  onSaveCashbox,
  onSubmit,
  onClearIncome,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  function handleAddInvestmentClick(event) {
    event.preventDefault()
    onAddInvestment()
  }

  function handleSaveCashboxClick(event) {
    event.preventDefault()
    onSaveCashbox()
  }

  function handleClearIncomeClick() {
    const confirmed = window.confirm('Deseja apagar a receita lançada deste mês?')
    if (!confirmed) return
    onClearIncome()
  }

  const totalInvestments = (investmentsList || []).reduce((acc, inv) => acc + Number(inv.valor || 0), 0)

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

      <form onSubmit={handleAddInvestmentClick} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
        <label className="block text-sm font-medium text-slate-700">Investimentos</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={investmentForm.name}
            onChange={(event) => onInvestmentFormChange('name', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Ex: Ações, Renda Fixa..."
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={investmentForm.valor}
            onChange={(event) => onInvestmentFormChange('valor', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Valor"
          />
        </div>
        <button
          type="submit"
          className="pressable rounded-xl bg-indigo-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          Adicionar
        </button>

        {investmentsList && investmentsList.length > 0 && (
          <div className="space-y-2 rounded-lg bg-white p-3">
            <div className="text-xs font-semibold uppercase text-slate-600">Investimentos adicionados</div>
            {investmentsList.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">{inv.nome}</div>
                  <div className="text-xs text-slate-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.valor)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveInvestment(inv.id)}
                  className="rounded-md bg-rose-500/20 px-2.5 py-1.5 text-xs text-rose-600 transition hover:bg-rose-500/30"
                >
                  Remover
                </button>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 text-right text-sm font-semibold text-slate-900">
              Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvestments)}
            </div>
          </div>
        )}
      </form>

      <form onSubmit={handleSaveCashboxClick} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
        <label className="block text-sm font-medium text-slate-700">Caixinha (Dinheiro Guardado)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={cashboxInput}
            onChange={(event) => onCashboxInputChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Valor da caixinha"
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


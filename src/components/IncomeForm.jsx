function IncomeForm({ incomeInput, onIncomeInputChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-slate-800/50 p-4">
      <label className="block text-sm text-slate-300">Receita do mês</label>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={incomeInput}
          onChange={(event) => onIncomeInputChange(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
          placeholder="Ex: 5000"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}

export default IncomeForm


function ExpenseForm({ categories, getCategoryColor, formData, onFieldChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 rounded-2xl bg-slate-50 p-5">
      <label className="block text-sm font-medium text-slate-700">Nova despesa</label>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={(event) => onFieldChange('description', event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        placeholder="Descrição"
        required
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: getCategoryColor?.(formData.category) }}
          />
          <select
            name="category"
            value={formData.category}
            onChange={(event) => onFieldChange('category', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={(event) => onFieldChange('amount', event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Valor"
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(formData.isInstallment)}
            onChange={(event) => onFieldChange('isInstallment', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Parcelado
        </label>

        {formData.isInstallment ? (
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Total</span>
              <input
                type="number"
                min="2"
                step="1"
                value={formData.installmentsTotal}
                onChange={(event) => onFieldChange('installmentsTotal', event.target.value)}
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Pagas</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.installmentsPaid}
                onChange={(event) => onFieldChange('installmentsPaid', event.target.value)}
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <span className="text-xs text-slate-500">
              Faltam{' '}
              {Math.max(
                0,
                Number(formData.installmentsTotal || 0) - Number(formData.installmentsPaid || 0),
              )}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(formData.isFixed)}
            onChange={(event) => onFieldChange('isFixed', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Despesa fixa
        </label>
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(event) => onFieldChange('date', event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          className="pressable rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Adicionar
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm


function ExpenseForm({ categories, formData, onFieldChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-slate-800/50 p-4">
      <label className="block text-sm text-slate-300">Nova despesa</label>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={(event) => onFieldChange('description', event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
        placeholder="Descrição"
        required
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          name="category"
          value={formData.category}
          onChange={(event) => onFieldChange('category', event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={(event) => onFieldChange('amount', event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
          placeholder="Valor"
          required
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(event) => onFieldChange('date', event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-indigo-500 transition focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-400"
        >
          Adicionar
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm


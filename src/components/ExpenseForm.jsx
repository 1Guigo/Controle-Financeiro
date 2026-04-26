function ExpenseForm({ categories, formData, onFieldChange, onSubmit }) {
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
        <select
          name="category"
          value={formData.category}
          onChange={(event) => onFieldChange('category', event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
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


import ExpenseForm from './ExpenseForm'
import { getCategoryColor } from '../lib/categories'

function ExpenseFormsPanel({
  incomes,
  incomeForm,
  editingIncomeId,
  editingExpenseId,
  expenseForm,
  categories,
  cashboxInput,
  onIncomeFormChange,
  onAddIncome,
  onEditIncome,
  onSaveEditIncome,
  onCancelEditIncome,
  onRemoveIncome,
  onCashboxInputChange,
  onSaveCashbox,
  onExpenseFieldChange,
  onAddExpense,
  onSaveEditExpense,
  onCancelEditExpense,
  onRemoveExpense,
}) {
  return (
    <div
      id="expense-form-panel"
      className="app-surface fade-up p-6"
    >
      <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900">Lançamentos</h2>
      <div className="space-y-5">
        {/* Formulário de Entrada de Dinheiro */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-medium text-slate-900">Entrada de Dinheiro</h3>
          {editingIncomeId ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome/Descrição"
                value={incomeForm.name}
                onChange={(e) => onIncomeFormChange('name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor"
                value={incomeForm.amount}
                onChange={(e) => onIncomeFormChange('amount', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={incomeForm.type}
                onChange={(e) => onIncomeFormChange('type', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="salário">Salário</option>
                <option value="vale">Vale</option>
                <option value="caixinha">Caixinha</option>
                <option value="outros">Outros</option>
              </select>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => onIncomeFormChange('date', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={onSaveEditIncome}
                  className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                >
                  Salvar
                </button>
                <button
                  onClick={onCancelEditIncome}
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome/Descrição"
                value={incomeForm.name}
                onChange={(e) => onIncomeFormChange('name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor"
                value={incomeForm.amount}
                onChange={(e) => onIncomeFormChange('amount', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={incomeForm.type}
                onChange={(e) => onIncomeFormChange('type', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="salário">Salário</option>
                <option value="vale">Vale</option>
                <option value="caixinha">Caixinha</option>
                <option value="outros">Outros</option>
              </select>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => onIncomeFormChange('date', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={onAddIncome}
                className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              >
                Adicionar Entrada
              </button>
            </div>
          )}
          {/* Lista de Entradas */}
          <div className="mt-4 space-y-2">
            {incomes.map((income) => (
              <div key={income.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{income.name}</p>
                  <p className="text-xs text-slate-500">{income.type} - {income.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">R$ {income.amount.toFixed(2)}</span>
                  <button
                    onClick={() => onEditIncome(income.id)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onRemoveIncome(income.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-medium text-slate-900">Caixinha</h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Salve o valor da caixinha para o mês selecionado.</p>
            <input
              type="number"
              step="0.01"
              placeholder="Valor da caixinha"
              value={cashboxInput}
              onChange={(e) => onCashboxInputChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={onSaveCashbox}
              className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Salvar Caixinha
            </button>
          </div>
        </div>

        {/* Formulário de Despesa */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-medium text-slate-900">Despesa</h3>
          {editingExpenseId ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Descrição"
                value={expenseForm.description}
                onChange={(e) => onExpenseFieldChange('description', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={expenseForm.category}
                onChange={(e) => onExpenseFieldChange('category', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Valor"
                value={expenseForm.amount}
                onChange={(e) => onExpenseFieldChange('amount', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => onExpenseFieldChange('date', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(expenseForm.isInstallment)}
                  onChange={(e) => onExpenseFieldChange('isInstallment', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Parcelado
              </label>
              {expenseForm.isInstallment && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="2"
                    step="1"
                    placeholder="Total parcelas"
                    value={expenseForm.installmentsTotal}
                    onChange={(e) => onExpenseFieldChange('installmentsTotal', e.target.value)}
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Pagas"
                    value={expenseForm.installmentsPaid}
                    onChange={(e) => onExpenseFieldChange('installmentsPaid', e.target.value)}
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(expenseForm.isFixed)}
                  onChange={(e) => onExpenseFieldChange('isFixed', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Despesa fixa
              </label>
              <div className="flex gap-2">
                <button
                  onClick={onSaveEditExpense}
                  className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                >
                  Salvar
                </button>
                <button
                  onClick={onCancelEditExpense}
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <ExpenseForm
              categories={categories}
              formData={expenseForm}
              getCategoryColor={getCategoryColor}
              onFieldChange={onExpenseFieldChange}
              onSubmit={onAddExpense}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseFormsPanel


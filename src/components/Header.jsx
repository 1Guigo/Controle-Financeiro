import { useState } from 'react'
import { formatCurrencyBRL } from '../lib/finance'

function Header({ monthLabel, balance, calculatedBalance, manualBalanceInput, onManualBalanceInputChange, onSaveManualBalance, onClearManualBalance, onAddExpenseClick, isDirty, onSave }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSaveManualBalance()
    setIsEditing(false)
  }

  const handleCancel = () => {
    onManualBalanceInputChange(manualBalanceInput) // reset to current
    setIsEditing(false)
  }

  const handleClear = () => {
    onClearManualBalance()
    setIsEditing(false)
  }

  return (
    <header className="app-surface fade-up mb-10 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            {monthLabel}
          </p>
          {isEditing ? (
            <div className="mt-2">
              <input
                type="number"
                step="0.01"
                value={manualBalanceInput}
                onChange={(e) => onManualBalanceInputChange(e.target.value)}
                className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl bg-transparent border-b-2 border-indigo-500 focus:outline-none"
                placeholder="Ajuste manual (ex: 100 ou -50)"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-400"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-400"
                >
                  Limpar Ajuste
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Calculado: {formatCurrencyBRL(calculatedBalance)}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {formatCurrencyBRL(balance)}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Saldo disponível no mês atual
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-2 text-indigo-500 hover:text-indigo-400 underline"
                >
                  Ajustar manualmente
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              isDirty 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {isDirty ? '● Alterações não salvas' : '● Tudo salvo'}
            </div>
            <button
              type="button"
              onClick={onSave}
              disabled={!isDirty}
              className={`pressable rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 ${
                isDirty
                  ? 'bg-green-500 hover:bg-green-400 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              Salvar
            </button>
          </div>
          <button
            type="button"
            onClick={onAddExpenseClick}
            className="pressable rounded-2xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            Adicionar gasto
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

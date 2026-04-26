import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrencyBRL } from '../lib/finance'

const CATEGORY_COLORS = [
  '#818cf8',
  '#22d3ee',
  '#34d399',
  '#f472b6',
  '#f59e0b',
  '#60a5fa',
  '#a78bfa',
  '#fb7185',
]

const USAGE_COLORS = ['#fb7185', '#34d399']

function renderTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-lg">
      <p className="font-medium">{item.name}</p>
      <p>{formatCurrencyBRL(item.value)}</p>
    </div>
  )
}

function Chart({ type, data, emptyMessage }) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  if (!data.length || total <= 0) {
    return (
      <div className="mt-4 flex h-[340px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center text-slate-400">
        {emptyMessage}
      </div>
    )
  }

  const colors = type === 'usage' ? USAGE_COLORS : CATEGORY_COLORS

  return (
    <div className="mt-4 h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart


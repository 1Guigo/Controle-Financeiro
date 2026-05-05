const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

const app = express()
const PORT = 3001
const DATABASE_PATH = path.join(__dirname, 'database.json')

const DEFAULT_FINANCE_DATA = {
  mes: '2026-05',
  receitas: [],
  despesas: [],
  caixinha: 0,
  saldoInicial: 0,
  ajusteManual: 0,
}

app.use(cors())
app.use(express.json())

/**
 * Read the JSON database file.
 * If the file does not exist, return default data.
 */
async function readDatabase() {
  try {
    const fileContents = await fs.readFile(DATABASE_PATH, 'utf8')
    const parsed = JSON.parse(fileContents)
    return parsed && typeof parsed === 'object' ? parsed : DEFAULT_FINANCE_DATA
  } catch (error) {
    if (error.code === 'ENOENT') {
      return DEFAULT_FINANCE_DATA
    }
    throw error
  }
}

/**
 * Write data to the JSON database file safely.
 * It writes to a temporary file first, then renames it.
 */
async function writeDatabase(data) {
  const safeData = {
    mes: String(data.mes || DEFAULT_FINANCE_DATA.mes),
    receitas: Array.isArray(data.receitas) ? data.receitas : [],
    despesas: Array.isArray(data.despesas) ? data.despesas : [],
    caixinha: typeof data.caixinha === 'number' ? data.caixinha : Number(data.caixinha) || 0,
    saldoInicial: typeof data.saldoInicial === 'number' ? data.saldoInicial : Number(data.saldoInicial) || 0,
    ajusteManual: typeof data.ajusteManual === 'number' ? data.ajusteManual : Number(data.ajusteManual) || 0,
  }

  const tempPath = `${DATABASE_PATH}.tmp`
  await fs.writeFile(tempPath, JSON.stringify(safeData, null, 2), 'utf8')
  await fs.rename(tempPath, DATABASE_PATH)
  return safeData
}

app.get('/finance', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data)
  } catch (error) {
    console.error('GET /finance error:', error)
    res.status(500).json({ error: 'Não foi possível ler os dados financeiros.' })
  }
})

app.post('/finance', async (req, res) => {
  try {
    const incoming = req.body

    if (!incoming || typeof incoming !== 'object' || typeof incoming.mes !== 'string') {
      return res.status(400).json({ error: 'Payload inválido. Esperado objeto com campo mes.' })
    }

    const savedData = await writeDatabase(incoming)
    res.json(savedData)
  } catch (error) {
    console.error('POST /finance error:', error)
    res.status(500).json({ error: 'Não foi possível salvar os dados financeiros.' })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})

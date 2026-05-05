const BACKEND_URL = 'http://localhost:3001'

export async function fetchFinance() {
  const response = await fetch(`${BACKEND_URL}/finance`)
  if (!response.ok) {
    throw new Error(`Backend fetch failed with status ${response.status}`)
  }
  return response.json()
}

export async function saveFinance(payload) {
  const response = await fetch(`${BACKEND_URL}/finance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Backend save failed: ${response.status} ${errorText}`)
  }
  return response.json()
}

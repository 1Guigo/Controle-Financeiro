import { CATEGORIES } from '../constants/finance'

export function getCategoryColor(categoryName) {
  const found = CATEGORIES.find((c) => c.name === categoryName)
  return found?.color || '#94a3b8'
}

export function getCategoryNames() {
  return CATEGORIES.map((c) => c.name)
}


export function pad2(n: number) {
  return String(n).padStart(2, "0")
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
}

export function nowISO() {
  return new Date().toISOString()
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseISOToDateKey(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return toDateKey(new Date())
  return toDateKey(d)
}


export function normalizeMoneyInput(input: string) {
  const raw = input.trim()
  if (!raw) return ""
  const cleaned = raw.replace(/[^\d.]/g, "")
  const parts = cleaned.split(".")
  const intPart = (parts[0] ?? "").replace(/^0+(\d)/, "$1")
  const fracPart = (parts[1] ?? "").slice(0, 2)
  if (cleaned.includes(".")) return `${intPart || "0"}.${fracPart}`
  return intPart || "0"
}

export function parseMoneyToCents(input: string) {
  const s = normalizeMoneyInput(input)
  if (!s) return 0
  const [i, f = ""] = s.split(".")
  const cents = Number.parseInt(i || "0", 10) * 100 + Number.parseInt((f + "00").slice(0, 2), 10)
  return Number.isFinite(cents) ? cents : 0
}

export function formatCents(cents: number) {
  const abs = Math.abs(cents)
  const sign = cents < 0 ? "-" : ""
  const i = Math.floor(abs / 100)
  const f = String(abs % 100).padStart(2, "0")
  return `${sign}${i}.${f}`
}


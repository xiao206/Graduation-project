import { createEmptyLedgerData, LEDGER_DATA_VERSION } from "@/domain/defaults"
import type { LedgerData, Transaction, TxnType } from "@/domain/types"
import { isValidCents, MAX_ABS_CENTS } from "@/utils/money"

const STORAGE_KEY = "gp:ledger"

function migrate(data: LedgerData): LedgerData {
  if (!data.version) data.version = 0

  const defaults = createEmptyLedgerData()
  const defaultCategoryIcon = new Map(defaults.categories.map((c) => [c.id, c.icon] as const))

  const next: LedgerData = {
    ...defaults,
    ...data,
    version: LEDGER_DATA_VERSION,
  }

  next.categories = (next.categories || []).map((c) => {
    const iconRaw = typeof c.icon === "string" ? c.icon.trim() : ""
    const iconLooksLikeType = !!iconRaw && /^[a-z0-9-]+$/i.test(iconRaw)
    const icon = iconLooksLikeType ? iconRaw : defaultCategoryIcon.get(c.id) || undefined
    return { ...c, icon }
  })

  next.transactions = (next.transactions || [])
    .filter((t) => t && typeof t.id === "string")
    .map((t) => {
      const amountCents = typeof t.amountCents === "number" ? Math.trunc(t.amountCents) : 0
      const occurredAt = typeof t.occurredAt === "string" ? t.occurredAt : new Date().toISOString()
      const type: TxnType = t.type === "income" ? "income" : t.type === "expense" ? "expense" : "expense"
      return {
        ...t,
        type,
        amountCents: Math.min(Math.max(0, amountCents), MAX_ABS_CENTS),
        occurredAt,
      } as Transaction
    })
    .filter((t) => isValidCents(t.amountCents) && t.amountCents > 0)

  next.budgets = (next.budgets || []).map((b) => {
    const totalCents = typeof b.totalCents === "number" ? Math.trunc(b.totalCents) : undefined
    return {
      ...b,
      totalCents: typeof totalCents === "number" ? Math.min(Math.max(0, totalCents), MAX_ABS_CENTS) : undefined,
    }
  })

  return next
}

export function loadLedgerData(): LedgerData {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return createEmptyLedgerData()
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as LedgerData) : (raw as LedgerData)
    return migrate(parsed)
  } catch {
    return createEmptyLedgerData()
  }
}

export function saveLedgerData(data: LedgerData) {
  const payload: LedgerData = { ...data, version: LEDGER_DATA_VERSION }
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(payload))
}

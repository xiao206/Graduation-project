import { createEmptyLedgerData, LEDGER_DATA_VERSION } from "@/domain/defaults"
import type { AALedgerData } from "@/domain/types"

const STORAGE_KEY = "aa:ledger"

function migrate(data: AALedgerData): AALedgerData {
  if (!data.version) data.version = 0
  const defaults = createEmptyLedgerData()

  const next: AALedgerData = {
    ...defaults,
    ...data,
    version: LEDGER_DATA_VERSION,
  }

  next.members = (next.members || [])
    .filter((m: any) => m && typeof m.id === "string")
    .map((m: any) => ({
      id: String(m.id || ""),
      name: String(m.name || ""),
      enabled: typeof m.enabled === "boolean" ? m.enabled : true,
      createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date().toISOString(),
    }))

  next.categories = (next.categories || [])
    .filter((c: any) => c && typeof c.id === "string")
    .map((c: any) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      icon: typeof c.icon === "string" ? c.icon : undefined,
      color: typeof c.color === "string" ? c.color : undefined,
      order: typeof c.order === "number" ? c.order : 0,
      enabled: typeof c.enabled === "boolean" ? c.enabled : true,
    }))

  next.bills = (next.bills || [])
    .filter((b: any) => b && typeof b.id === "string")
    .map((b: any) => ({
      id: String(b.id || ""),
      amountCents: typeof b.amountCents === "number" ? Math.trunc(b.amountCents) : 0,
      payerId: String(b.payerId || ""),
      participantIds: Array.isArray(b.participantIds) ? b.participantIds.map((x: any) => String(x)).filter(Boolean) : [],
      categoryId: String(b.categoryId || ""),
      note: typeof b.note === "string" ? b.note : undefined,
      occurredAt: typeof b.occurredAt === "string" ? b.occurredAt : new Date().toISOString(),
      createdAt: typeof b.createdAt === "string" ? b.createdAt : new Date().toISOString(),
      updatedAt: typeof b.updatedAt === "string" ? b.updatedAt : new Date().toISOString(),
    }))

  next.settings = {
    ...defaults.settings,
    ...next.settings,
    defaultDormName: String((next.settings as any)?.defaultDormName || defaults.settings.defaultDormName),
    defaultParticipantIds: Array.isArray((next.settings as any)?.defaultParticipantIds)
      ? (next.settings as any).defaultParticipantIds.map((x: any) => String(x)).filter(Boolean)
      : defaults.settings.defaultParticipantIds,
    currency: "CNY",
  }

  return next
}

export function loadLedgerData(): AALedgerData {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return createEmptyLedgerData()
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as AALedgerData) : (raw as AALedgerData)
    return migrate(parsed)
  } catch {
    return createEmptyLedgerData()
  }
}

export function saveLedgerData(data: AALedgerData) {
  const payload: AALedgerData = { ...data, version: LEDGER_DATA_VERSION }
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(payload))
}


import { createEmptyLedgerData, LEDGER_DATA_VERSION } from "@/domain/defaults"
import type { LFLedgerData, LFItemStatus, LFItemType } from "@/domain/types"

const STORAGE_KEY = "lf:ledger"

function migrate(data: LFLedgerData): LFLedgerData {
  if (!data.version) data.version = 0
  const defaults = createEmptyLedgerData()

  const next: LFLedgerData = {
    ...defaults,
    ...data,
    version: LEDGER_DATA_VERSION,
  }

  next.users = (next.users || [])
    .filter((u: any) => u && typeof u.id === "string")
    .map((u: any) => ({
      id: String(u.id || ""),
      username: String(u.username || ""),
      passwordHash: String(u.passwordHash || ""),
      createdAt: typeof u.createdAt === "string" ? u.createdAt : new Date().toISOString(),
    }))
    .filter((u) => u.id && u.username && u.passwordHash)

  next.categories = (next.categories || [])
    .filter((c: any) => c && typeof c.id === "string")
    .map((c: any) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      color: typeof c.color === "string" ? c.color : undefined,
      order: typeof c.order === "number" ? c.order : 0,
      enabled: typeof c.enabled === "boolean" ? c.enabled : true,
    }))

  next.items = (next.items || [])
    .filter((x: any) => x && typeof x.id === "string")
    .map((x: any) => ({
      id: String(x.id || ""),
      type: (x.type === "found" ? "found" : "lost") as LFItemType,
      title: String(x.title || ""),
      description: typeof x.description === "string" ? x.description : undefined,
      categoryId: String(x.categoryId || ""),
      location: typeof x.location === "string" ? x.location : undefined,
      occurredAt: typeof x.occurredAt === "string" ? x.occurredAt : new Date().toISOString(),
      contact: typeof x.contact === "string" ? x.contact : undefined,
      status: (x.status === "claimed" ? "claimed" : x.status === "closed" ? "closed" : "open") as LFItemStatus,
      ownerUserId: String(x.ownerUserId || ""),
      createdAt: typeof x.createdAt === "string" ? x.createdAt : new Date().toISOString(),
      updatedAt: typeof x.updatedAt === "string" ? x.updatedAt : new Date().toISOString(),
    }))
    .filter((x) => x.id && x.title && x.ownerUserId)

  next.settings = {
    ...defaults.settings,
    ...next.settings,
    campusName: String((next.settings as any)?.campusName || defaults.settings.campusName),
    currentUserId: typeof (next.settings as any)?.currentUserId === "string" ? (next.settings as any).currentUserId : undefined,
  }

  const userIdSet = new Set(next.users.map((u) => u.id))
  if (next.settings.currentUserId && !userIdSet.has(next.settings.currentUserId)) next.settings.currentUserId = undefined

  return next
}

export function loadLedgerData(): LFLedgerData {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return createEmptyLedgerData()
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as LFLedgerData) : (raw as LFLedgerData)
    return migrate(parsed)
  } catch {
    return createEmptyLedgerData()
  }
}

export function saveLedgerData(data: LFLedgerData) {
  const payload: LFLedgerData = { ...data, version: LEDGER_DATA_VERSION }
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(payload))
}

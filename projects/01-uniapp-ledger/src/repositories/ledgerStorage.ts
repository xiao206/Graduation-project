import { createEmptyLedgerData, LEDGER_DATA_VERSION } from "@/domain/defaults"
import type { LedgerData } from "@/domain/types"

const STORAGE_KEY = "gp:ledger"

function migrate(data: LedgerData): LedgerData {
  if (!data.version) data.version = 0
  if (data.version === LEDGER_DATA_VERSION) return data

  const next: LedgerData = {
    ...createEmptyLedgerData(),
    ...data,
    version: LEDGER_DATA_VERSION,
  }

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


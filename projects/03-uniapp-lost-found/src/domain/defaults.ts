import type { LFCategory, LFLedgerData } from "./types"

export const LEDGER_DATA_VERSION = 1

export const defaultCategories: LFCategory[] = [
  { id: "card", name: "证件", color: "#2563EB", order: 10, enabled: true },
  { id: "electronic", name: "电子产品", color: "#7C3AED", order: 20, enabled: true },
  { id: "book", name: "书本资料", color: "#F97316", order: 30, enabled: true },
  { id: "clothes", name: "衣物", color: "#DB2777", order: 40, enabled: true },
  { id: "key", name: "钥匙", color: "#0EA5E9", order: 50, enabled: true },
  { id: "other", name: "其他", color: "#64748B", order: 60, enabled: true },
]

export function createEmptyLedgerData(): LFLedgerData {
  return {
    version: LEDGER_DATA_VERSION,
    users: [],
    categories: [...defaultCategories],
    items: [],
    settings: {
      campusName: "默认校区",
      currentUserId: undefined,
    },
  }
}

import type { AACategory, AALedgerData, AAMember } from "./types"

export const LEDGER_DATA_VERSION = 1

export const defaultMembers: AAMember[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `m_${i + 1}`,
  name: `成员${i + 1}`,
  enabled: true,
  createdAt: new Date(Date.now() + i).toISOString(),
}))

export const defaultCategories: AACategory[] = [
  { id: "water", name: "水费", icon: "download", color: "#0EA5E9", order: 10, enabled: true },
  { id: "electric", name: "电费", icon: "flag-filled", color: "#F59E0B", order: 20, enabled: true },
  { id: "net", name: "网费", icon: "paperplane-filled", color: "#6366F1", order: 30, enabled: true },
  { id: "supply", name: "生活用品", icon: "cart-filled", color: "#EC4899", order: 40, enabled: true },
  { id: "meal", name: "外卖聚餐", icon: "shop-filled", color: "#F97316", order: 50, enabled: true },
  { id: "other", name: "其他", icon: "more-filled", color: "#64748B", order: 60, enabled: true },
]

export function createEmptyLedgerData(): AALedgerData {
  return {
    version: LEDGER_DATA_VERSION,
    members: [...defaultMembers],
    bills: [],
    categories: [...defaultCategories],
    settings: {
      defaultDormName: "默认宿舍",
      defaultParticipantIds: defaultMembers.map((m) => m.id),
      currency: "CNY",
    },
  }
}

import { computed, reactive } from "vue"
import type { AABill, AACategory, AALedgerData, AAMember, AASettleResult, AASettings } from "@/domain/types"
import { createEmptyLedgerData } from "@/domain/defaults"
import { loadLedgerData, saveLedgerData } from "@/repositories/aaStorage"
import { parseISOToDateKey, toMonthKey } from "@/utils/date"
import { createId } from "@/utils/id"
import { isValidCents, MAX_ABS_CENTS } from "@/utils/money"

type CreateBillInput = {
  amountCents: number
  payerId: string
  participantIds: string[]
  categoryId: string
  occurredAt: string
  note?: string
}

type UpdateBillPatch = Partial<Omit<AABill, "id" | "createdAt">>

const state = reactive<{ data: AALedgerData }>({
  data: loadLedgerData(),
})

function normalizeOccurredAt(input: string) {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  const y = d.getFullYear()
  if (y < 2000 || y > 2100) return new Date().toISOString()
  return d.toISOString()
}

function persist() {
  saveLedgerData(state.data)
}

function normalize() {
  state.data.categories.sort((a, b) => a.order - b.order)
  state.data.members.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
  state.data.bills.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
}

function normalizeMemberIds(ids: unknown) {
  const arr = Array.isArray(ids) ? ids : []
  return arr.map((x) => String(x)).filter(Boolean)
}

function ensureInitialized() {
  const defaults = createEmptyLedgerData()
  if (!state.data || typeof state.data.version !== "number") state.data = defaults
  state.data.members = (state.data.members || []).map((m) => ({
    id: String(m.id || ""),
    name: String(m.name || ""),
    enabled: typeof m.enabled === "boolean" ? m.enabled : true,
    createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date().toISOString(),
  }))
  state.data.categories = (state.data.categories || []).map((c) => ({
    ...c,
    id: String(c.id || ""),
    name: String(c.name || ""),
    enabled: typeof c.enabled === "boolean" ? c.enabled : true,
    order: typeof c.order === "number" ? c.order : 0,
  }))
  state.data.bills = (state.data.bills || [])
    .filter((b) => b && typeof b.id === "string")
    .map((b) => {
      const amountCents = typeof b.amountCents === "number" ? Math.trunc(b.amountCents) : 0
      const occurredAt = normalizeOccurredAt(String(b.occurredAt || ""))
      const payerId = String(b.payerId || "")
      const participantIds = normalizeMemberIds(b.participantIds)
      return {
        ...b,
        payerId,
        participantIds,
        amountCents: Math.min(Math.max(0, amountCents), MAX_ABS_CENTS),
        occurredAt,
      } as AABill
    })
    .filter((b) => isValidCents(b.amountCents) && b.amountCents > 0 && b.payerId && b.participantIds.length > 0)
  normalize()
  persist()
}

ensureInitialized()

export function useAASplitStore() {
  const membersEnabled = computed(() => state.data.members.filter((m) => m.enabled))
  const categoriesEnabled = computed(() => state.data.categories.filter((c) => c.enabled).sort((a, b) => a.order - b.order))
  const recentBills = computed(() => state.data.bills.slice(0, 20))

  function updateSettings(patch: Partial<AASettings>) {
    state.data.settings = {
      ...state.data.settings,
      ...patch,
      defaultParticipantIds: Array.isArray(patch.defaultParticipantIds)
        ? patch.defaultParticipantIds.map(String).filter(Boolean)
        : state.data.settings.defaultParticipantIds,
      currency: "CNY",
    }
    persist()
  }

  function upsertMember(member: AAMember) {
    const idx = state.data.members.findIndex((m) => m.id === member.id)
    if (idx >= 0) state.data.members.splice(idx, 1, member)
    else state.data.members.push(member)
    normalize()
    persist()
  }

  function setMemberEnabled(id: string, enabled: boolean) {
    const idx = state.data.members.findIndex((m) => m.id === id)
    if (idx < 0) return false
    state.data.members[idx] = { ...state.data.members[idx], enabled }
    persist()
    return true
  }

  function upsertCategory(category: AACategory) {
    const idx = state.data.categories.findIndex((c) => c.id === category.id)
    if (idx >= 0) state.data.categories.splice(idx, 1, category)
    else state.data.categories.push(category)
    normalize()
    persist()
  }

  function setCategoryEnabled(id: string, enabled: boolean) {
    const idx = state.data.categories.findIndex((c) => c.id === id)
    if (idx < 0) return false
    state.data.categories[idx] = { ...state.data.categories[idx], enabled }
    persist()
    return true
  }

  function createBill(input: CreateBillInput) {
    if (!isValidCents(input.amountCents) || input.amountCents <= 0) return ""
    if (!input.payerId) return ""
    if (!input.participantIds?.length) return ""
    const now = new Date().toISOString()
    const bill: AABill = {
      id: createId("bill"),
      createdAt: now,
      updatedAt: now,
      amountCents: Math.min(Math.trunc(input.amountCents), MAX_ABS_CENTS),
      payerId: input.payerId,
      participantIds: input.participantIds.map(String).filter(Boolean),
      categoryId: input.categoryId,
      occurredAt: normalizeOccurredAt(input.occurredAt),
      note: input.note?.trim() ? input.note.trim() : undefined,
    }
    state.data.bills.unshift(bill)
    normalize()
    persist()
    return bill.id
  }

  function updateBill(id: string, patch: UpdateBillPatch) {
    const idx = state.data.bills.findIndex((b) => b.id === id)
    if (idx < 0) return false
    const prev = state.data.bills[idx]
    if (typeof patch.amountCents !== "undefined" && (!isValidCents(patch.amountCents) || patch.amountCents <= 0)) return false
    const next: AABill = {
      ...prev,
      ...patch,
      id: prev.id,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
    }
    next.amountCents = Math.min(Math.max(0, Math.trunc(next.amountCents)), MAX_ABS_CENTS)
    next.occurredAt = normalizeOccurredAt(next.occurredAt)
    next.participantIds = normalizeMemberIds(next.participantIds)
    if (!next.payerId || next.participantIds.length <= 0 || next.amountCents <= 0) return false
    state.data.bills.splice(idx, 1, next)
    normalize()
    persist()
    return true
  }

  function deleteBill(id: string) {
    const idx = state.data.bills.findIndex((b) => b.id === id)
    if (idx < 0) return false
    state.data.bills.splice(idx, 1)
    normalize()
    persist()
    return true
  }

  function exportJSON() {
    return JSON.stringify(state.data)
  }

  function importJSON(raw: string) {
    try {
      const parsed = JSON.parse(raw) as AALedgerData
      state.data = parsed
      ensureInitialized()
      return true
    } catch {
      return false
    }
  }

  function getBillById(id: string) {
    return state.data.bills.find((b) => b.id === id)
  }

  function listBillsByMonth(month: string) {
    return state.data.bills.filter((b) => toMonthKey(new Date(b.occurredAt)) === month)
  }

  function groupBillsByDate(bills: AABill[]) {
    const map = new Map<string, AABill[]>()
    for (const b of bills) {
      const k = parseISOToDateKey(b.occurredAt)
      const arr = map.get(k) ?? []
      arr.push(b)
      map.set(k, arr)
    }
    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1))
    return keys.map((k) => ({ date: k, items: map.get(k) ?? [] }))
  }

  function settle(range: { startISO: string; endISO: string }) {
    const start = new Date(range.startISO)
    const end = new Date(range.endISO)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return []
    const s = start.getTime()
    const e = end.getTime()

    const members = state.data.members
    const nameMap = new Map(members.map((m) => [m.id, m.name] as const))
    const enabledSet = new Set(members.filter((m) => m.enabled).map((m) => m.id))

    const paid = new Map<string, number>()
    const share = new Map<string, number>()
    for (const m of members) {
      paid.set(m.id, 0)
      share.set(m.id, 0)
    }

    const bills = state.data.bills.filter((b) => {
      const t = new Date(b.occurredAt).getTime()
      if (Number.isNaN(t)) return false
      if (t < s || t > e) return false
      if (!enabledSet.has(b.payerId)) return false
      const participants = b.participantIds.filter((id) => enabledSet.has(id))
      return b.amountCents > 0 && participants.length > 0
    })

    for (const b of bills) {
      paid.set(b.payerId, (paid.get(b.payerId) ?? 0) + b.amountCents)
      const participants = b.participantIds.filter((id) => enabledSet.has(id))
      const n = participants.length
      if (n <= 0) continue
      const base = Math.floor(b.amountCents / n)
      const remainder = b.amountCents - base * n
      for (const id of participants) share.set(id, (share.get(id) ?? 0) + base)
      for (let i = 0; i < remainder; i++) {
        const id = participants[i % n]
        share.set(id, (share.get(id) ?? 0) + 1)
      }
    }

    const results: AASettleResult[] = members
      .filter((m) => enabledSet.has(m.id))
      .map((m) => {
        const paidCents = paid.get(m.id) ?? 0
        const shareCents = share.get(m.id) ?? 0
        const netCents = paidCents - shareCents
        return {
          memberId: m.id,
          name: nameMap.get(m.id) || m.id,
          paidCents,
          shareCents,
          netCents,
          receiveCents: netCents > 0 ? netCents : 0,
          payCents: netCents < 0 ? -netCents : 0,
        }
      })
      .sort((a, b) => b.netCents - a.netCents)

    return results
  }

  return {
    state,
    membersEnabled,
    categoriesEnabled,
    recentBills,
    updateSettings,
    upsertMember,
    setMemberEnabled,
    upsertCategory,
    setCategoryEnabled,
    createBill,
    updateBill,
    deleteBill,
    exportJSON,
    importJSON,
    getBillById,
    listBillsByMonth,
    groupBillsByDate,
    settle,
  }
}

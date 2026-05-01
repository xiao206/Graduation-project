import { computed, reactive } from "vue"
import type { Account, Budget, Category, LedgerData, Transaction, TxnType } from "@/domain/types"
import { createEmptyLedgerData } from "@/domain/defaults"
import { loadLedgerData, saveLedgerData } from "@/repositories/ledgerStorage"
import { parseISOToDateKey, toMonthKey } from "@/utils/date"
import { createId } from "@/utils/id"
import { isValidCents, MAX_ABS_CENTS } from "@/utils/money"

type CreateTxnInput = {
  type: TxnType
  amountCents: number
  categoryId: string
  accountId: string
  occurredAt: string
  note?: string
  tags?: string[]
}

type UpdateTxnPatch = Partial<Omit<Transaction, "id" | "createdAt">>

const state = reactive<{ data: LedgerData }>({
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
  state.data.accounts.sort((a, b) => a.order - b.order)
  state.data.transactions.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
}

function recalcAccountBalances() {
  const balances = new Map<string, number>()
  for (const a of state.data.accounts) balances.set(a.id, 0)
  for (const t of state.data.transactions) {
    const cur = balances.get(t.accountId) ?? 0
    const delta = t.type === "income" ? t.amountCents : t.type === "expense" ? -t.amountCents : 0
    balances.set(t.accountId, cur + delta)
  }
  state.data.accounts = state.data.accounts.map((a) => ({ ...a, balanceCents: balances.get(a.id) ?? 0 }))
}

function ensureInitialized() {
  if (!state.data || typeof state.data.version !== "number") state.data = createEmptyLedgerData()
  state.data.transactions = (state.data.transactions || [])
    .map((t) => ({
      ...t,
      amountCents: typeof t.amountCents === "number" ? Math.min(Math.max(0, Math.trunc(t.amountCents)), MAX_ABS_CENTS) : 0,
      occurredAt: normalizeOccurredAt(String(t.occurredAt || "")),
    }))
    .filter((t) => isValidCents(t.amountCents) && t.amountCents > 0)
  normalize()
  recalcAccountBalances()
  persist()
}

ensureInitialized()

export function useLedgerStore() {
  const categoriesByType = computed(() => {
    const expense = state.data.categories.filter((c) => c.enabled && c.type === "expense")
    const income = state.data.categories.filter((c) => c.enabled && c.type === "income")
    return { expense, income }
  })

  const accountsEnabled = computed(() => state.data.accounts.filter((a) => a.enabled))

  const recentTransactions = computed(() => state.data.transactions.slice(0, 20))

  function createTransaction(input: CreateTxnInput) {
    if (!isValidCents(input.amountCents) || input.amountCents <= 0) return ""
    const now = new Date().toISOString()
    const txn: Transaction = {
      id: createId("txn"),
      createdAt: now,
      updatedAt: now,
      ...input,
      amountCents: Math.min(input.amountCents, MAX_ABS_CENTS),
      occurredAt: normalizeOccurredAt(input.occurredAt),
    }
    state.data.transactions.unshift(txn)
    normalize()
    recalcAccountBalances()
    persist()
    return txn.id
  }

  function updateTransaction(id: string, patch: UpdateTxnPatch) {
    const idx = state.data.transactions.findIndex((t) => t.id === id)
    if (idx < 0) return false
    const prev = state.data.transactions[idx]
    if (typeof patch.amountCents !== "undefined" && (!isValidCents(patch.amountCents) || patch.amountCents <= 0)) return false
    const next: Transaction = {
      ...prev,
      ...patch,
      id: prev.id,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
    }
    if (typeof next.amountCents !== "number" || !Number.isFinite(next.amountCents) || next.amountCents <= 0) return false
    next.amountCents = Math.min(Math.trunc(next.amountCents), MAX_ABS_CENTS)
    next.occurredAt = normalizeOccurredAt(next.occurredAt)
    state.data.transactions.splice(idx, 1, next)
    normalize()
    recalcAccountBalances()
    persist()
    return true
  }

  function deleteTransaction(id: string) {
    const idx = state.data.transactions.findIndex((t) => t.id === id)
    if (idx < 0) return false
    state.data.transactions.splice(idx, 1)
    normalize()
    recalcAccountBalances()
    persist()
    return true
  }

  function upsertCategory(category: Category) {
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

  function upsertAccount(account: Account) {
    const idx = state.data.accounts.findIndex((a) => a.id === account.id)
    if (idx >= 0) state.data.accounts.splice(idx, 1, account)
    else state.data.accounts.push(account)
    normalize()
    recalcAccountBalances()
    persist()
  }

  function setAccountEnabled(id: string, enabled: boolean) {
    const idx = state.data.accounts.findIndex((a) => a.id === id)
    if (idx < 0) return false
    state.data.accounts[idx] = { ...state.data.accounts[idx], enabled }
    recalcAccountBalances()
    persist()
    return true
  }

  function getBudget(month: string) {
    return state.data.budgets.find((b) => b.month === month)
  }

  function setMonthlyBudget(month: string, totalCents?: number) {
    const idx = state.data.budgets.findIndex((b) => b.month === month)
    const next: Budget = idx >= 0 ? { ...state.data.budgets[idx] } : { id: createId("budget"), month }
    if (typeof totalCents === "number") {
      if (!Number.isFinite(totalCents) || totalCents < 0) return
      next.totalCents = Math.min(Math.trunc(totalCents), MAX_ABS_CENTS)
    }
    else delete next.totalCents
    if (idx >= 0) state.data.budgets.splice(idx, 1, next)
    else state.data.budgets.push(next)
    persist()
  }

  function exportJSON() {
    return JSON.stringify(state.data)
  }

  function importJSON(raw: string) {
    try {
      const parsed = JSON.parse(raw) as LedgerData
      state.data = parsed
      normalize()
      recalcAccountBalances()
      persist()
      return true
    } catch {
      return false
    }
  }

  function getTxnById(id: string) {
    return state.data.transactions.find((t) => t.id === id)
  }

  function listTxnsByMonth(month: string) {
    return state.data.transactions.filter((t) => toMonthKey(new Date(t.occurredAt)) === month)
  }

  function groupTxnsByDate(txns: Transaction[]) {
    const map = new Map<string, Transaction[]>()
    for (const t of txns) {
      const k = parseISOToDateKey(t.occurredAt)
      const arr = map.get(k) ?? []
      arr.push(t)
      map.set(k, arr)
    }
    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1))
    return keys.map((k) => ({ date: k, items: map.get(k) ?? [] }))
  }

  return {
    state,
    categoriesByType,
    accountsEnabled,
    recentTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    upsertCategory,
    setCategoryEnabled,
    upsertAccount,
    setAccountEnabled,
    getBudget,
    setMonthlyBudget,
    exportJSON,
    importJSON,
    getTxnById,
    listTxnsByMonth,
    groupTxnsByDate,
  }
}

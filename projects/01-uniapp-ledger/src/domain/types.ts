export type TxnType = "expense" | "income" | "transfer"

export type Transaction = {
  id: string
  type: TxnType
  amountCents: number
  categoryId: string
  accountId: string
  occurredAt: string
  note?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  type: Exclude<TxnType, "transfer">
  name: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
}

export type Account = {
  id: string
  name: string
  type: "cash" | "bank" | "ecard" | "other"
  balanceCents: number
  order: number
  enabled: boolean
}

export type Budget = {
  id: string
  month: string
  totalCents?: number
  byCategoryCents?: Record<string, number>
}

export type Settings = {
  defaultAccountId?: string
}

export type LedgerData = {
  version: number
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  budgets: Budget[]
  settings: Settings
}

export type AAMember = {
  id: string
  name: string
  enabled: boolean
  createdAt: string
}

export type AACategory = {
  id: string
  name: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
}

export type AABill = {
  id: string
  amountCents: number
  payerId: string
  participantIds: string[]
  categoryId: string
  note?: string
  occurredAt: string
  createdAt: string
  updatedAt: string
}

export type AASettings = {
  defaultDormName: string
  defaultParticipantIds: string[]
  currency: "CNY"
}

export type AALedgerData = {
  version: number
  members: AAMember[]
  bills: AABill[]
  categories: AACategory[]
  settings: AASettings
}

export type AASettleResult = {
  memberId: string
  name: string
  paidCents: number
  shareCents: number
  netCents: number
  receiveCents: number
  payCents: number
}

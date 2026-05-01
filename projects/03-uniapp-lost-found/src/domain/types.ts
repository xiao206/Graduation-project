export type LFUser = {
  id: string
  username: string
  passwordHash: string
  createdAt: string
}

export type LFCategory = {
  id: string
  name: string
  color?: string
  order: number
  enabled: boolean
}

export type LFItemType = "lost" | "found"
export type LFItemStatus = "open" | "claimed" | "closed"

export type LFItem = {
  id: string
  type: LFItemType
  title: string
  description?: string
  categoryId: string
  location?: string
  occurredAt: string
  contact?: string
  status: LFItemStatus
  ownerUserId: string
  createdAt: string
  updatedAt: string
}

export type LFSettings = {
  campusName: string
  currentUserId?: string
}

export type LFLedgerData = {
  version: number
  users: LFUser[]
  categories: LFCategory[]
  items: LFItem[]
  settings: LFSettings
}

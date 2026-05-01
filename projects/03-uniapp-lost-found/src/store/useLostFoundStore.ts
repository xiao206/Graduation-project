import { computed, reactive } from "vue"
import type { LFCategory, LFLedgerData, LFItem, LFItemStatus, LFItemType, LFSettings, LFUser } from "@/domain/types"
import { createEmptyLedgerData } from "@/domain/defaults"
import { loadLedgerData, saveLedgerData } from "@/repositories/lostFoundStorage"
import { createId } from "@/utils/id"

type RegisterInput = {
  username: string
  password: string
}

type LoginInput = {
  username: string
  password: string
}

type CreateItemInput = {
  type: LFItemType
  title: string
  description?: string
  categoryId: string
  location?: string
  occurredAt: string
  contact?: string
}

type UpdateItemPatch = Partial<Omit<LFItem, "id" | "createdAt" | "ownerUserId">>

const state = reactive<{ data: LFLedgerData }>({
  data: loadLedgerData(),
})

function persist() {
  saveLedgerData(state.data)
}

function normalize() {
  state.data.categories.sort((a, b) => a.order - b.order)
  state.data.users.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
  state.data.items.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
}

function hashPassword(username: string, password: string) {
  const input = `${username}::${password}`
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, "0")
}

function ensureInitialized() {
  const defaults = createEmptyLedgerData()
  if (!state.data || typeof state.data.version !== "number") state.data = defaults

  state.data.users = (state.data.users || [])
    .map((u) => ({
      id: String(u.id || ""),
      username: String(u.username || ""),
      passwordHash: String(u.passwordHash || ""),
      createdAt: typeof u.createdAt === "string" ? u.createdAt : new Date().toISOString(),
    }))
    .filter((u) => u.id && u.username && u.passwordHash)

  state.data.categories = (state.data.categories || [])
    .map((c) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      color: typeof c.color === "string" ? c.color : undefined,
      order: typeof c.order === "number" ? c.order : 0,
      enabled: typeof c.enabled === "boolean" ? c.enabled : true,
    }))
    .filter((c) => c.id && c.name)

  state.data.items = (state.data.items || [])
    .map((x) => ({
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

  state.data.settings = {
    ...defaults.settings,
    ...state.data.settings,
    campusName: String((state.data.settings as any)?.campusName || defaults.settings.campusName),
    currentUserId: typeof (state.data.settings as any)?.currentUserId === "string" ? (state.data.settings as any).currentUserId : undefined,
  }

  const userIdSet = new Set(state.data.users.map((u) => u.id))
  if (state.data.settings.currentUserId && !userIdSet.has(state.data.settings.currentUserId)) state.data.settings.currentUserId = undefined

  const hasDemoUser = state.data.users.some((u) => u.id === "u_demo")
  const hasDemoItems = state.data.items.some((x) => x.ownerUserId === "u_demo")
  if (!hasDemoUser || !hasDemoItems) {
    const now = new Date()
    const demoUser: LFUser = hasDemoUser
      ? (state.data.users.find((u) => u.id === "u_demo") as LFUser)
      : {
          id: "u_demo",
          username: "demo",
          passwordHash: hashPassword("demo", "1234"),
          createdAt: now.toISOString(),
        }

    if (!hasDemoUser) state.data.users.push(demoUser)

    if (!hasDemoItems) {
      const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
      const atNoon = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0)).toISOString()
      const t = (d: Date) => d.toISOString()

      const demoItems: LFItem[] = [
      {
        id: createId("item"),
        type: "lost",
        title: "校园卡",
        description: "姓名：张同学，卡面磨损较明显。捡到的同学麻烦联系我，谢谢！",
        categoryId: "card",
        location: "一食堂",
        occurredAt: atNoon(daysAgo(0)),
        contact: "微信：demo_aa",
        status: "open",
        ownerUserId: demoUser.id,
        createdAt: t(daysAgo(0)),
        updatedAt: t(daysAgo(0)),
      },
      {
        id: createId("item"),
        type: "found",
        title: "钥匙串（黑色挂绳）",
        description: "在图书馆门口台阶捡到，挂绳上有小熊挂件。",
        categoryId: "key",
        location: "图书馆门口",
        occurredAt: atNoon(daysAgo(1)),
        contact: "QQ：12345678",
        status: "open",
        ownerUserId: demoUser.id,
        createdAt: t(daysAgo(1)),
        updatedAt: t(daysAgo(1)),
      },
      {
        id: createId("item"),
        type: "lost",
        title: "AirPods 耳机",
        description: "白色，充电盒有贴纸。大概率在操场附近掉的。",
        categoryId: "electronic",
        location: "操场跑道",
        occurredAt: atNoon(daysAgo(2)),
        contact: undefined,
        status: "open",
        ownerUserId: demoUser.id,
        createdAt: t(daysAgo(2)),
        updatedAt: t(daysAgo(2)),
      },
      {
        id: createId("item"),
        type: "found",
        title: "高数教材",
        description: "封面写了名字缩写，暂时放在二教保安室。",
        categoryId: "book",
        location: "二教 1 楼",
        occurredAt: atNoon(daysAgo(3)),
        contact: "电话：188****0000",
        status: "claimed",
        ownerUserId: demoUser.id,
        createdAt: t(daysAgo(3)),
        updatedAt: t(daysAgo(1)),
      },
      {
        id: createId("item"),
        type: "lost",
        title: "蓝色外套",
        description: "深蓝运动外套，袖口有白色条纹。",
        categoryId: "clothes",
        location: "宿舍楼下快递点",
        occurredAt: atNoon(daysAgo(4)),
        contact: "微信：demo_aa",
        status: "closed",
        ownerUserId: demoUser.id,
        createdAt: t(daysAgo(4)),
        updatedAt: t(daysAgo(0)),
      },
      ]

      state.data.items.push(...demoItems)
    }
  }

  normalize()
  persist()
}

ensureInitialized()

export function useLostFoundStore() {
  const categoriesEnabled = computed(() => state.data.categories.filter((c) => c.enabled).sort((a, b) => a.order - b.order))

  const currentUser = computed(() => {
    const id = state.data.settings.currentUserId
    if (!id) return undefined
    return state.data.users.find((u) => u.id === id)
  })

  const isLoggedIn = computed(() => !!currentUser.value)

  const recentItems = computed(() => state.data.items.slice(0, 20))

  function updateSettings(patch: Partial<LFSettings>) {
    state.data.settings = {
      ...state.data.settings,
      ...patch,
      campusName: typeof (patch as any)?.campusName === "string" ? String((patch as any).campusName || "默认校区") : state.data.settings.campusName,
      currentUserId: typeof (patch as any)?.currentUserId === "string" ? String((patch as any).currentUserId || "") || undefined : state.data.settings.currentUserId,
    }
    persist()
  }

  function register(input: RegisterInput) {
    const username = input.username.trim()
    const password = input.password
    if (!username || username.length < 2) return { ok: false as const, message: "用户名太短" }
    if (!password || password.length < 4) return { ok: false as const, message: "密码太短" }
    const exists = state.data.users.some((u) => u.username.toLowerCase() === username.toLowerCase())
    if (exists) return { ok: false as const, message: "用户名已存在" }
    const now = new Date().toISOString()
    const user: LFUser = { id: createId("u"), username, passwordHash: hashPassword(username, password), createdAt: now }
    state.data.users.push(user)
    state.data.settings.currentUserId = user.id
    normalize()
    persist()
    return { ok: true as const }
  }

  function login(input: LoginInput) {
    const username = input.username.trim()
    const password = input.password
    if (!username || !password) return { ok: false as const, message: "请输入账号密码" }
    const u = state.data.users.find((x) => x.username.toLowerCase() === username.toLowerCase())
    if (!u) return { ok: false as const, message: "账号不存在" }
    if (u.passwordHash !== hashPassword(u.username, password)) return { ok: false as const, message: "密码错误" }
    state.data.settings.currentUserId = u.id
    persist()
    return { ok: true as const }
  }

  function logout() {
    state.data.settings.currentUserId = undefined
    persist()
  }

  function upsertCategory(category: LFCategory) {
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

  function createItem(input: CreateItemInput) {
    const u = currentUser.value
    if (!u) return ""
    const title = input.title.trim()
    if (!title) return ""
    const now = new Date().toISOString()
    const item: LFItem = {
      id: createId("item"),
      type: input.type,
      title,
      description: input.description?.trim() ? input.description.trim() : undefined,
      categoryId: String(input.categoryId || ""),
      location: input.location?.trim() ? input.location.trim() : undefined,
      occurredAt: input.occurredAt,
      contact: input.contact?.trim() ? input.contact.trim() : undefined,
      status: "open",
      ownerUserId: u.id,
      createdAt: now,
      updatedAt: now,
    }
    state.data.items.unshift(item)
    normalize()
    persist()
    return item.id
  }

  function updateItem(id: string, patch: UpdateItemPatch) {
    const idx = state.data.items.findIndex((x) => x.id === id)
    if (idx < 0) return false
    const prev = state.data.items[idx]
    const u = currentUser.value
    if (!u || u.id !== prev.ownerUserId) return false

    const next: LFItem = {
      ...prev,
      ...patch,
      id: prev.id,
      ownerUserId: prev.ownerUserId,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
    }
    next.title = String(next.title || "").trim()
    next.description = next.description?.trim() ? next.description.trim() : undefined
    next.location = next.location?.trim() ? next.location.trim() : undefined
    next.contact = next.contact?.trim() ? next.contact.trim() : undefined
    if (!next.title) return false
    state.data.items.splice(idx, 1, next)
    normalize()
    persist()
    return true
  }

  function setItemStatus(id: string, status: LFItemStatus) {
    return updateItem(id, { status })
  }

  function deleteItem(id: string) {
    const idx = state.data.items.findIndex((x) => x.id === id)
    if (idx < 0) return false
    const prev = state.data.items[idx]
    const u = currentUser.value
    if (!u || u.id !== prev.ownerUserId) return false
    state.data.items.splice(idx, 1)
    normalize()
    persist()
    return true
  }

  function getItemById(id: string) {
    return state.data.items.find((x) => x.id === id)
  }

  function searchItems(query: string) {
    const q = query.trim().toLowerCase()
    if (!q) return state.data.items
    const catMap = new Map(state.data.categories.map((c) => [c.id, c.name] as const))
    return state.data.items.filter((x) => {
      const cat = catMap.get(x.categoryId) || ""
      return `${x.title} ${x.description || ""} ${x.location || ""} ${x.contact || ""} ${cat}`.toLowerCase().includes(q)
    })
  }

  return {
    state,
    categoriesEnabled,
    currentUser,
    isLoggedIn,
    recentItems,
    updateSettings,
    register,
    login,
    logout,
    upsertCategory,
    setCategoryEnabled,
    createItem,
    updateItem,
    setItemStatus,
    deleteItem,
    getItemById,
    searchItems,
  }
}

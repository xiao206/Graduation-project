import type { Account, Category, LedgerData } from "./types"

export const LEDGER_DATA_VERSION = 1

export const defaultCategories: Category[] = [
  { id: "c_exp_food", type: "expense", name: "餐饮", icon: "shop-filled", color: "#F97316", order: 10, enabled: true },
  { id: "c_exp_shop", type: "expense", name: "购物", icon: "bag-filled", color: "#EC4899", order: 20, enabled: true },
  { id: "c_exp_trans", type: "expense", name: "交通", icon: "paperplane-filled", color: "#3B82F6", order: 30, enabled: true },
  { id: "c_exp_home", type: "expense", name: "居住", icon: "home-filled", color: "#10B981", order: 40, enabled: true },
  { id: "c_exp_play", type: "expense", name: "娱乐", icon: "star-filled", color: "#8B5CF6", order: 50, enabled: true },
  { id: "c_exp_other", type: "expense", name: "其他", icon: "more-filled", color: "#64748B", order: 60, enabled: true },
  { id: "c_inc_salary", type: "income", name: "工资", icon: "wallet-filled", color: "#22C55E", order: 10, enabled: true },
  { id: "c_inc_bonus", type: "income", name: "奖金", icon: "gift-filled", color: "#16A34A", order: 20, enabled: true },
  { id: "c_inc_part", type: "income", name: "兼职", icon: "personadd-filled", color: "#0EA5E9", order: 30, enabled: true },
  { id: "c_inc_other", type: "income", name: "其他", icon: "plus-filled", color: "#64748B", order: 40, enabled: true },
]

export const defaultAccounts: Account[] = [
  { id: "a_cash", name: "现金", type: "cash", balanceCents: 0, order: 10, enabled: true },
  { id: "a_bank", name: "银行卡", type: "bank", balanceCents: 0, order: 20, enabled: true },
]

export function createEmptyLedgerData(): LedgerData {
  return {
    version: LEDGER_DATA_VERSION,
    transactions: [],
    categories: [...defaultCategories],
    accounts: [...defaultAccounts],
    budgets: [],
    settings: { defaultAccountId: "a_cash" },
  }
}

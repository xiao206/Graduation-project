import assert from "node:assert/strict"
import { formatCents, normalizeMoneyInput, parseMoneyToCents } from "../src/utils/money.ts"

assert.equal(normalizeMoneyInput("0012"), "12")
assert.equal(normalizeMoneyInput("12.345"), "12.34")
assert.equal(normalizeMoneyInput("12."), "12.")

assert.equal(parseMoneyToCents("0"), 0)
assert.equal(parseMoneyToCents("1"), 100)
assert.equal(parseMoneyToCents("1.2"), 120)
assert.equal(parseMoneyToCents("1.02"), 102)
assert.equal(parseMoneyToCents("001.02"), 102)

assert.equal(formatCents(0), "0.00")
assert.equal(formatCents(1), "0.01")
assert.equal(formatCents(100), "1.00")
assert.equal(formatCents(-120), "-1.20")

console.log("smoke ok")

import fs from "node:fs"
import path from "node:path"

const projectRoot = path.resolve(process.cwd())
const fromDir = path.join(projectRoot, "src", "static")
const toDir = path.join(projectRoot, "dist", "build", "h5", "static")

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name)
    const d = path.join(dest, name)
    const st = fs.statSync(s)
    if (st.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

if (fs.existsSync(fromDir)) {
  fs.rmSync(toDir, { recursive: true, force: true })
  copyDir(fromDir, toDir)
}


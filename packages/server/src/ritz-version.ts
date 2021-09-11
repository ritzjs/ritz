import {pathExists, readFile, writeFile} from "fs-extra"
import {resolve} from "path"

export const ritzVersionFilename = "_ritz-version.txt"

export function getRitzVersion(): string {
  try {
    const pkgJson = require("ritz/package.json")
    return pkgJson.version as string
  } catch {
    return ""
  }
}

export async function isVersionMatched(buildFolder: string = ".ritz/build") {
  const versionStore = resolve(buildFolder, ritzVersionFilename)
  if (!(await pathExists(versionStore))) return false

  try {
    const buffer = await readFile(versionStore)
    const version = getRitzVersion()
    const read = buffer.toString().trim().replace("\n", "")
    return read === version
  } catch (err) {
    return false
  }
}

export async function saveRitzVersion(buildFolder: string = ".ritz/build") {
  const versionStore = resolve(buildFolder, ritzVersionFilename)
  const version = getRitzVersion()
  await writeFile(versionStore, version)
}

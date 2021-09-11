import {existsSync, readJSON} from "fs-extra"
import {resolve} from "path"
import pkgDir from "pkg-dir"

export enum IsRitzRootError {
  NotRitz,
  NotRoot,
  BadPackageJson,
}

const checkParent = async (): Promise<false | number> => {
  const rootDir = await pkgDir("./")

  if (rootDir) {
    const file = await readJSON(resolve(rootDir, "package.json"))

    if (file && Object.keys(file.dependencies || {}).includes("ritz")) {
      return process.cwd().slice(rootDir.length).split("/").length - 1
    }
  }

  return false
}

/**
 * @name isRitzRoot
 * @returns {IsRitzRootError}
 * notRitz -> when can't find package.json in current folder and first found in parent
 *             doesn't have ritz in dependencies
 * notRoot -> if in a nested folder of ritz project (found ritz as depend in a parent package.json)
 * badPackageJson -> an error occurred while reading local package.json
 */

export const isRitzRoot = async (): Promise<{
  err: boolean
  message?: IsRitzRootError
  depth?: number
}> => {
  try {
    const local = await readJSON("./package.json")
    if (local) {
      if (local.dependencies?.["ritz"] || local.devDependencies?.["ritz"]) {
        return {err: false}
      } else {
        return {
          err: true,
          message: IsRitzRootError.NotRitz,
        }
      }
    }
    return {err: true, message: IsRitzRootError.BadPackageJson}
  } catch (err: any) {
    // No local package.json
    if (err.code === "ENOENT") {
      const out = await checkParent()

      if (existsSync("./ritz.config.js") || existsSync("./ritz.config.ts")) {
        return {err: false}
      }

      if (out === false) {
        return {
          err: true,
          message: IsRitzRootError.NotRitz,
        }
      } else {
        return {
          err: true,
          message: IsRitzRootError.NotRoot,
          depth: out,
        }
      }
    }
  }
  return {err: true}
}

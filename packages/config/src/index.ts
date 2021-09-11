import {existsSync, readJSONSync} from "fs-extra"
import {NextConfig, NextConfigComplete} from "next/dist/server/config-shared"
import path, {join} from "path"
const debug = require("debug")("ritz:config")

type NextExperimental = NextConfigComplete["experimental"]

interface Experimental extends NextExperimental {
  isomorphicResolverImports?: boolean
}

export interface RitzConfig extends Omit<NextConfig, "experimental" | "future"> {
  target?: string
  experimental?: Experimental
  future?: NextConfig["future"]
  cli?: {
    clearConsoleOnRitzDev?: boolean
    httpProxy?: string
    httpsProxy?: string
    noProxy?: string
  }
  log?: {
    level: "trace" | "debug" | "info" | "warn" | "error" | "fatal"
  }
  middleware?: Record<string, any> &
    {
      (req: any, res: any, next: any): Promise<void> | void
      type?: string
      config?: {
        cookiePrefix?: string
      }
    }[]
  customServer?: {
    hotReload?: boolean
  }
}

export interface RitzConfigNormalized extends RitzConfig {
  _meta: {
    packageName: string
  }
}

export function getProjectRoot() {
  return path.dirname(getConfigSrcPath())
}

export function getConfigSrcPath() {
  const tsPath = path.resolve(path.join(process.cwd(), "ritz.config.ts"))
  if (existsSync(tsPath)) {
    return tsPath
  } else {
    const jsPath = path.resolve(path.join(process.cwd(), "ritz.config.js"))
    return jsPath
  }
}
declare global {
  namespace NodeJS {
    interface Global {
      ritzConfig: RitzConfigNormalized
    }
  }
}

/**
 * @param {boolean | undefined} reload - reimport config files to reset global cache
 */
export const getConfig = (reload?: boolean): RitzConfigNormalized => {
  if (global.ritzConfig && Object.keys(global.ritzConfig).length > 0 && !reload) {
    return global.ritzConfig
  }

  const {PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER} = require("next/constants")

  const projectRoot = getProjectRoot()

  let pkgJson: any

  const pkgJsonPath = join(getProjectRoot(), "package.json")
  if (existsSync(pkgJsonPath)) {
    pkgJson = readJSONSync(pkgJsonPath)
  }

  let ritzConfig = {
    _meta: {
      packageName: pkgJson?.name,
    },
  }

  const nextConfigPath = path.join(projectRoot, "next.config.js")
  const ritzConfigPath = path.join(projectRoot, ".ritz.config.compiled.js")

  debug("nextConfigPath: " + nextConfigPath)
  debug("ritzConfigPath: " + ritzConfigPath)

  let loadedNextConfig = {}
  let loadedRitzConfig: any = {}
  try {
    // --------------------------------
    // Load next.config.js if it exists
    // --------------------------------
    if (existsSync(nextConfigPath)) {
      // eslint-disable-next-line no-eval -- block webpack from following this module path
      loadedNextConfig = eval("require")(nextConfigPath)
      if (typeof loadedNextConfig === "function") {
        const phase =
          process.env.NODE_ENV === "production" ? PHASE_PRODUCTION_SERVER : PHASE_DEVELOPMENT_SERVER
        loadedNextConfig = loadedNextConfig(phase, {})
      }
    }

    // --------------------------------
    // Load ritz.config.js
    // --------------------------------
    // eslint-disable-next-line no-eval -- block webpack from following this module path
    loadedRitzConfig = eval("require")(ritzConfigPath)
    if (typeof loadedRitzConfig === "function") {
      const phase =
        process.env.NODE_ENV === "production" ? PHASE_PRODUCTION_SERVER : PHASE_DEVELOPMENT_SERVER
      loadedRitzConfig = loadedRitzConfig(phase, {})
    }
    // -------------
    // Merge configs
    // -------------
    ritzConfig = {
      ...ritzConfig,
      ...loadedNextConfig,
      ...loadedRitzConfig,
    }
  } catch (error) {
    debug("Failed to load config in getConfig()", error)
  }

  // Idk why, but during startup first result of loading ritz config is empty
  // Therefore don't cache it so that next time will load the full config properly
  if (Object.keys(loadedRitzConfig).length) {
    global.ritzConfig = ritzConfig
  }
  return ritzConfig
}

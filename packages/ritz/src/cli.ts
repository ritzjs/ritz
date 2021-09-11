import chalk from "chalk"
import * as path from "path"
import pkgDir from "pkg-dir"
import resolveFrom from "resolve-from"
import {parseSemver} from "./utils/parse-semver"

async function main() {
  const options = require("minimist")(process.argv.slice(2))

  if (parseSemver(process.version).major < 12) {
    console.log(
      chalk.yellow(
        `You are using an unsupported version of Node.js. Please switch to v12 or newer.\n`,
      ),
    )
    process.exit()
  }

  const globalRitzPath = resolveFrom(__dirname, "ritz")
  const localRitzPath = resolveFrom.silent(process.cwd(), "ritz")

  const isInDevelopmentAsGloballyLinked = __dirname.includes("packages/ritz/dist")

  let ritzPkgPath
  if (isInDevelopmentAsGloballyLinked) {
    ritzPkgPath = globalRitzPath
  } else {
    // localRitzPath won't exist if used outside a ritz app directory
    ritzPkgPath = localRitzPath || globalRitzPath
  }

  const cliPkgPath = resolveFrom(ritzPkgPath, "@ritzjs/cli")

  const cli = require(cliPkgPath)

  const hasVersionFlag = options._.length === 0 && (options.v || options.version)
  const hasVerboseFlag = options._.length === 0 && (options.V || options.verbose)

  if (hasVersionFlag) {
    if (hasVerboseFlag) {
      console.log("debug: ritzPkgPath:", ritzPkgPath)
      console.log("debug: cliPkgPath:", cliPkgPath, "\n")
    }
    try {
      const osName = require("os-name")
      console.log(`${osName()} | ${process.platform}-${process.arch} | Node: ${process.version}\n`)

      const globalRitzPkgJsonPath = pkgDir.sync(globalRitzPath) as string
      const localRitzPkgJsonPath = pkgDir.sync(localRitzPath)

      if (globalRitzPkgJsonPath !== localRitzPkgJsonPath) {
        // This branch won't run if user does `npx ritz` or `yarn ritz`
        const globalVersion = require(path.join(globalRitzPkgJsonPath, "package.json")).version
        console.log(`ritz: ${globalVersion} (global)`)
      }

      if (localRitzPkgJsonPath) {
        const localVersion = require(path.join(localRitzPkgJsonPath, "package.json")).version
        console.log(`ritz: ${localVersion} (local)`)
      }

      await printEnvInfo()

      console.log("") // One last new line
    } catch (e) {
      throw new Error(`Ritz Error: ${e}`)
    }
    process.exit(0)
  } else {
    cli.run()
  }
}

/**
 * Prints detailed system info
 */
async function printEnvInfo() {
  const hasYarn = require("has-yarn")
  const envinfo = require("envinfo")

  const packageManager = `\n  Package manager: ${hasYarn() ? "yarn" : "npm"}`

  const env = await envinfo.run(
    {
      System: ["OS", "CPU", "Memory", "Shell"],
      Binaries: ["Node", "Yarn", "npm", "Watchman"],
      npmPackages: ["ritz", "typescript", "react", "react-dom", "prisma", "@prisma/client"],
    },
    {showNotFound: true},
  )

  console.log(packageManager, env)
}

main().catch((e) => {
  console.error(e)
})

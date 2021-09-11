import {Hook} from "@oclif/config"
import chalk from "chalk"
import {isRitzRoot, IsRitzRootError} from "./utils/is-ritz-root"

const commandAllowListGlobal = [
  "-h",
  "--help",
  "help",
  "new",
  "autocomplete",
  "autocomplete:script",
]
const argumentAllowListGlobal = ["-h", "--help", "help"]

export const hook: Hook<"init"> = async function (options) {
  const {argv, id} = options
  if (argv.length > 0 && argumentAllowListGlobal.some((arg) => argv.includes(arg))) return
  if (id && commandAllowListGlobal.includes(id)) return
  if (id === "db" && argv.length === 0) return

  const {err, message, depth} = await isRitzRoot()

  if (err) {
    switch (message) {
      case IsRitzRootError.NotRitz:
        return this.error(
          `You are not inside a Ritz project, so this command won't work.\nYou can create a new app with ${chalk.bold(
            "ritz new myapp",
          )} or see help with ${chalk.bold("ritz help")}`,
        )
      case IsRitzRootError.NotRoot:
        const help = depth
          ? `\nUse ${chalk.bold("cd " + "../".repeat(depth))} to get to the root of your project`
          : ""

        return this.error(
          `You are currently in a sub-folder of your Ritz app, but this command must be used from the root of your project.${help}`,
        )
      case IsRitzRootError.BadPackageJson:
        return this.error(`Reading package.json file`)
      default:
        return this.error(`An error occurred`)
    }
  }
}

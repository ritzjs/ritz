import {getProjectRoot} from "@ritzjs/config"
import {watch} from "chokidar"
import fs from "fs"
import os from "os"
import path from "path"
import * as REPL from "repl"
import {REPLCommand, REPLServer} from "repl"
// import {loadDependencies} from '../utils/load-dependencies'
import {getRitzModulePaths, loadRitz} from "./utils/load-ritz"
const debug = require("debug")("ritz:repl")

const projectRoot = getProjectRoot()

const loadRitzModules = (repl: REPLServer, modules: any) => {
  Object.assign(repl.context, modules)
}

const loadModules = async (repl: REPLServer) => {
  // loadRitzDependencies(repl)
  loadRitzModules(repl, await loadRitz())
}

const commands = {
  reload: {
    help: "Reload all modules",
    async action(this: REPLServer) {
      this.clearBufferedCommand()
      console.log("Reloading all modules...")
      await loadModules(this)
      this.displayPrompt()
    },
  },
}

const defineCommands = (repl: REPLServer, commands: Record<string, REPLCommand>) => {
  Object.entries(commands).forEach(([keyword, cmd]) => repl.defineCommand(keyword, cmd))
}

const setupSelfRolledHistory = (repl: any, path: string) => {
  function init() {
    try {
      const history = fs.readFileSync(path, {encoding: "utf8"})
      const nonEmptyLines = history.split(os.EOL).filter((line) => line.trim())
      repl.history.push(...nonEmptyLines.reverse())
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        throw err
      }
    }
  }

  function onExit() {
    const addedHistory = repl.lines.join(os.EOL)
    fs.appendFileSync(path, addedHistory)
  }

  init()
  repl.on("exit", onExit)
}

const setupHistory = (repl: any) => {
  const ritzConsoleHistoryPath = path.join(projectRoot, ".ritz-console-history")
  if (repl.setupHistory) {
    repl.setupHistory(ritzConsoleHistoryPath, () => {})
  } else {
    setupSelfRolledHistory(repl, ritzConsoleHistoryPath)
  }
}

const initializeRepl = async (replOptions: REPL.ReplOptions) => {
  debug("initializeRepl")
  const modules = await loadRitz()

  debug("Starting REPL...")
  const repl = REPL.start(replOptions)

  loadRitzModules(repl, modules)
  defineCommands(repl, commands)
  setupHistory(repl)

  return repl
}

const setupFileWatchers = async (repl: REPLServer) => {
  debug("Setting up file watchers...")
  const watchers = [
    // watch('package.json').on('change', () => Console.loadDependencies(repl)),
    watch(await getRitzModulePaths(), {
      ignoreInitial: true,
    }).on("all", () => loadModules(repl)),
  ]

  repl.on("reset", async () => {
    debug("Reset, so reloading modules...")
    await loadModules(repl)
  })
  repl.on("exit", () => watchers.forEach((watcher) => watcher.close()))
}

const runRepl = async (replOptions: REPL.ReplOptions) => {
  const repl = await initializeRepl(replOptions)
  repl.on("exit", () => process.exit())
  await setupFileWatchers(repl)
}

// const loadRitzDependencies = (repl: REPLServer) => {
//   Object.assign(repl.context, loadDependencies(process.cwd()))
// }

export {runRepl}

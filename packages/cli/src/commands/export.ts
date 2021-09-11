import {ServerConfig} from "@ritzjs/server"
import {Command, flags} from "@oclif/command"

export class Export extends Command {
  static description = "Exports a static page"
  static aliases = ["e"]

  static flags = {
    help: flags.help({char: "h"}),
    outdir: flags.string({
      char: "o",
      description: "set the output dir (defaults to 'out')",
    }),
  }

  async run() {
    const config: ServerConfig = {
      rootFolder: process.cwd(),
      env: "prod",
    }
    this.parse(Export)

    try {
      const {ritzExport} = await import("@ritzjs/server")
      await ritzExport(config)
    } catch (err) {
      console.error(err)
      process.exit(1) // clean up?
    }
  }
}

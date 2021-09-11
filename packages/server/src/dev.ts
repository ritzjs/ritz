import {getConfig} from "@ritzjs/config"
import {log} from "@ritzjs/display"
import {normalize, ServerConfig} from "./config"
import {customServerExists, nextStartDev, startCustomServer} from "./next-utils"

export async function dev(config: ServerConfig) {
  const {rootFolder, nextBin} = await normalize({...config, env: "dev"})

  if (customServerExists()) {
    log.success("Using your custom server")

    const ritzConfig = getConfig()
    const watch = ritzConfig.customServer?.hotReload ?? true

    await startCustomServer(rootFolder, config, {watch})
  } else {
    await nextStartDev(nextBin, rootFolder, {} as any, rootFolder, config)
  }
}

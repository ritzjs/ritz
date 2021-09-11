import {Fallbackable} from "./fallbackable"
import {logFailedVersionFetch} from "./get-latest-version"
import {fetchDistTags} from "./npm-fetch"

export const getRitzDependencyVersion = async (
  cliVersion: string,
): Promise<Fallbackable<string>> => {
  try {
    const {latest, main} = await fetchDistTags("ritz")

    if (cliVersion.includes("main")) {
      return {value: main, isFallback: false}
    }

    return {value: latest, isFallback: false}
  } catch (error) {
    const fallback = "latest"
    logFailedVersionFetch("ritz", fallback)
    return {value: fallback, isFallback: true}
  }
}

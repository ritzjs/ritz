import {Ctx} from "ritz"
import delay from "delay"

export default async function getNoauthBasic(_: any, ctx: Ctx) {
  await delay(10)
  return "noauth-basic-result"
}

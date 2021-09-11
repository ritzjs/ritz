import {Ctx} from "ritz"

export default async function logout(_: any, ctx: Ctx) {
  await ctx.session.$revoke()
  return true
}

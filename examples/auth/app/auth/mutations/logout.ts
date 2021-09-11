import {Ctx} from "ritz"

export default async function logout(_: any, ctx: Ctx) {
  return await ctx.session.$revoke()
}

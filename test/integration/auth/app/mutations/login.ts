import {Ctx} from "ritz"

export default async function login(_: any, ctx: Ctx) {
  await ctx.session.$create({userId: 1, role: "user"})
  return true
}

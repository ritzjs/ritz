import { Ctx } from "ritz"

export default async function logout(_: any, { session }: Ctx) {
  return await session.$revoke()
}

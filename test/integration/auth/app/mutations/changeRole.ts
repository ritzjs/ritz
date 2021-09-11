import {Ctx, PublicData, setPublicDataForUser} from "ritz"

type ChangeRoleProps = {
  userId: PublicData["userId"]
  role: string
}
export default async function changeRole({userId, role}: ChangeRoleProps, ctx: Ctx) {
  // create two sessions to be changed
  await ctx.session.$create({userId, role: "user"})
  await ctx.session.$create({userId, role: "user"})

  await setPublicDataForUser(userId, {role})
}

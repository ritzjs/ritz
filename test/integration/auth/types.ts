import {DefaultCtx, SessionContext, SimpleRolesIsAuthorized} from "ritz"

declare module "ritz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<"user">
    PublicData: {
      userId: number
      role: "user"
    }
  }
}

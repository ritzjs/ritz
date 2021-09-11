import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "ritz"
import { User } from "db"

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = "ADMIN" | "USER"

declare module "ritz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}

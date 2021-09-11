import { DefaultCtx, SessionContext } from "ritz"

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = "ADMIN" | "USER"

declare module "ritz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    PublicData: {
      userId: string
      roles: Role[]
    }
  }
}

import {RitzConfig, sessionMiddleware, simpleRolesIsAuthorized} from "ritz"
import db from "./db"

const config: RitzConfig = {
  // replace me
  middleware: [
    sessionMiddleware({
      sessionExpiryMinutes: 15,
      isAuthorized: simpleRolesIsAuthorized,
      getSession: (handle) => db.get("sessions").find({handle}).value(),
      getSessions: (userId) => db.get("sessions").filter({userId}).value(),
      createSession: (session) => {
        return db.get("sessions").push(session).write()
      },
      updateSession: async (handle, session) => {
        return db.get("sessions").find({handle}).assign(session).write()
      },
      deleteSession: (handle) => db.get("sessions").remove({handle}).write(),
    }),
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = config

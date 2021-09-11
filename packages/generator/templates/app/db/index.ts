import { enhancePrisma } from "ritz"
import { PrismaClient } from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
export default new EnhancedPrisma()

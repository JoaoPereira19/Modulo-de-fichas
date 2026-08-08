import PrismaClientPkg from '@prisma/client'
const { PrismaClient } = PrismaClientPkg

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
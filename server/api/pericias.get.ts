import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.pericia.findMany({
    orderBy: { nome: 'asc' },
  })
})
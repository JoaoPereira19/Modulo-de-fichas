import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.item.findMany({
    orderBy: { nome: 'asc' },
  })
})
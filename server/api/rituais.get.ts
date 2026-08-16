import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.ritual.findMany({
    orderBy: [{ elemento: 'asc' }, { circulo: 'asc' }, { nome: 'asc' }],
  })
})
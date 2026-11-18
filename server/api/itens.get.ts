import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'

export default definirRota(async () => {
  return await prisma.item.findMany({
    orderBy: { nome: 'asc' },
  })
})
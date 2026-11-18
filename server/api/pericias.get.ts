import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'

export default definirRota(async () => {
  return await prisma.pericia.findMany({
    orderBy: { nome: 'asc' },
  })
})
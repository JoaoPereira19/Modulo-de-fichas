import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'

export default definirRota(async () => {
  return await prisma.origem.findMany({ orderBy: { nome: 'asc' } })
})
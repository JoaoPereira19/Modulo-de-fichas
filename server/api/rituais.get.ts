import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'

export default definirRota(async () => {
  return await prisma.ritual.findMany({
    orderBy: [{ elemento: 'asc' }, { circulo: 'asc' }, { nome: 'asc' }],
  })
})
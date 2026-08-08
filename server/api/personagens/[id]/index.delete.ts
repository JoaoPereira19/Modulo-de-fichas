import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  await prisma.personagem.delete({ where: { id } })

  return { sucesso: true }
})
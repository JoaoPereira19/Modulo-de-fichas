import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const personagemItemId = getRouterParam(event, 'personagemItemId')

  await prisma.personagemItem.delete({ where: { id: personagemItemId } })

  return { sucesso: true }
})
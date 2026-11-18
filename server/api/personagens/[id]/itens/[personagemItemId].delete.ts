import { prisma } from '../../../../utils/prisma'
import { lerIdDaRota } from '../../../../utils/validacao'

export default defineEventHandler(async (event) => {
  const personagemItemId = lerIdDaRota(event, 'personagemItemId')

  await prisma.personagemItem.delete({ where: { id: personagemItemId } })

  return { sucesso: true }
})
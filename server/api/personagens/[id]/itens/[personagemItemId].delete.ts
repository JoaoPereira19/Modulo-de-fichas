import { prisma } from '../../../../utils/prisma'
import { definirRota } from '../../../../utils/erros'
import { lerIdDaRota } from '../../../../utils/validacao'

export default definirRota(async (event) => {
  const personagemItemId = lerIdDaRota(event, 'personagemItemId')

  await prisma.personagemItem.delete({ where: { id: personagemItemId } })

  return { sucesso: true }
}, {
  P2025: 'Esse item já não está no inventário.',
})
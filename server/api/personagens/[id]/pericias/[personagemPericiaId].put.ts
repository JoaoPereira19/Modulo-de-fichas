import { prisma } from '../../../../utils/prisma'
import { lerIdDaRota, lerBodyValidado } from '../../../../utils/validacao'
import { esquemaAlterarTreino } from '../../../../utils/esquemas'

export default defineEventHandler(async (event) => {
  const personagemPericiaId = lerIdDaRota(event, 'personagemPericiaId')
  const body = await lerBodyValidado(event, esquemaAlterarTreino)

  const atualizado = await prisma.personagemPericia.update({
    where: { id: personagemPericiaId },
    data: { treino: body.treino },
    include: { pericia: true },
  })

  return atualizado
})
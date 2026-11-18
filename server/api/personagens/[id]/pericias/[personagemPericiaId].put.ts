import { prisma } from '../../../../utils/prisma'
import { definirRota } from '../../../../utils/erros'
import { lerIdDaRota, lerBodyValidado } from '../../../../utils/validacao'
import { esquemaAlterarTreino } from '../../../../utils/esquemas'

export default definirRota(async (event) => {
  const personagemPericiaId = lerIdDaRota(event, 'personagemPericiaId')
  const body = await lerBodyValidado(event, esquemaAlterarTreino)

  const atualizado = await prisma.personagemPericia.update({
    where: { id: personagemPericiaId },
    data: { treino: body.treino },
    include: { pericia: true },
  })

  return atualizado
}, {
  P2025: 'Essa perícia não está nessa ficha.',
})
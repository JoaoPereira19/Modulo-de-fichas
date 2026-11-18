import { prisma } from '../../../utils/prisma'
import { definirRota } from '../../../utils/erros'
import { lerIdDaRota, lerBodyValidado } from '../../../utils/validacao'
import { esquemaAdicionarPericia } from '../../../utils/esquemas'

export default definirRota(async (event) => {
  const personagemId = lerIdDaRota(event, 'id')
  const body = await lerBodyValidado(event, esquemaAdicionarPericia)

  return prisma.personagemPericia.create({
    data: {
      // connect: o Prisma confere se a ficha e o registro do catálogo existem antes de criar a ligação.
      personagem: { connect: { id: personagemId } },
      pericia: { connect: { id: body.periciaId } },
      treino: body.treino ?? 'LEIGO',
    },
    include: { pericia: true },
  })
}, {
  P2002: 'Essa perícia já foi adicionada a essa ficha.',
  P2025: 'Ficha ou perícia não encontrada.',
})

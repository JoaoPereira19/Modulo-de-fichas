import { prisma } from '../../../utils/prisma'
import { definirRota } from '../../../utils/erros'
import { lerIdDaRota, lerBodyValidado } from '../../../utils/validacao'
import { esquemaAdicionarRitual } from '../../../utils/esquemas'

export default definirRota(async (event) => {
  const personagemId = lerIdDaRota(event, 'id')
  const body = await lerBodyValidado(event, esquemaAdicionarRitual)

  return prisma.personagemRitual.create({
    data: {
      // connect: o Prisma confere se a ficha e o registro do catálogo existem antes de criar a ligação.
      personagem: { connect: { id: personagemId } },
      ritual: { connect: { id: body.ritualId } },
    },
    include: { ritual: true },
  })
}, {
  P2002: 'Esse ritual já foi adicionado a essa ficha.',
  P2025: 'Ficha ou ritual não encontrado.',
})

import { prisma } from '../../../utils/prisma'
import { definirRota } from '../../../utils/erros'
import { lerIdDaRota, lerBodyValidado } from '../../../utils/validacao'
import { esquemaAdicionarItem } from '../../../utils/esquemas'

export default definirRota(async (event) => {
  const personagemId = lerIdDaRota(event, 'id')
  const body = await lerBodyValidado(event, esquemaAdicionarItem)

  return prisma.personagemItem.create({
    data: {
      // connect: o Prisma confere se a ficha e o registro do catálogo existem antes de criar a ligação.
      personagem: { connect: { id: personagemId } },
      item: { connect: { id: body.itemId } },
      quantidade: body.quantidade ?? 1,
    },
    include: { item: true },
  })
}, {
  P2002: 'Esse item já está no inventário dessa ficha.',
  P2025: 'Ficha ou item não encontrado.',
})

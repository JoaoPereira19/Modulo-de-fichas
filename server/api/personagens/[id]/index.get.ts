import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const personagem = await prisma.personagem.findUnique({
    where: { id },
    include: {
      pericias: { include: { pericia: true } },
      rituais: { include: { ritual: true } },
      itens: { include: { item: true } },
    },
  })

  if (!personagem) {
    throw createError({ statusCode: 404, statusMessage: 'Ficha não encontrada' })
  }

  return personagem
})
import { Prisma } from '@prisma/client'
import { prisma } from '../../../utils/prisma'
import { lerIdDaRota, lerBodyValidado } from '../../../utils/validacao'
import { esquemaAdicionarItem } from '../../../utils/esquemas'

export default defineEventHandler(async (event) => {
  const personagemId = lerIdDaRota(event, 'id')
  const body = await lerBodyValidado(event, esquemaAdicionarItem)

  try {
    const personagemItem = await prisma.personagemItem.create({
      data: {
        personagemId: personagemId,
        itemId: body.itemId,
        quantidade: body.quantidade ?? 1,
      },
      include: { item: true },
    })

    return personagemItem
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Esse item já está no inventário dessa ficha.',
      })
    }
    throw e
  }
})
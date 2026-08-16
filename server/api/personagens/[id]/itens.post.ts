import { Prisma } from '@prisma/client'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const personagemId = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const personagemItem = await prisma.personagemItem.create({
      data: {
        personagemId: personagemId!,
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
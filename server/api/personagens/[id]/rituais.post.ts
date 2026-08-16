import { Prisma } from '@prisma/client'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const personagemId = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const personagemRitual = await prisma.personagemRitual.create({
      data: {
        personagemId: personagemId!,
        ritualId: body.ritualId,
      },
      include: { ritual: true },
    })

    return personagemRitual
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Esse ritual já foi adicionado a essa ficha.',
      })
    }
    throw e
  }
})
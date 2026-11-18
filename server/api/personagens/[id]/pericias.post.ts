import { Prisma } from '@prisma/client'
import { prisma } from '../../../utils/prisma'
import { lerIdDaRota, lerBodyValidado } from '../../../utils/validacao'
import { esquemaAdicionarPericia } from '../../../utils/esquemas'

export default defineEventHandler(async (event) => {
  const personagemId = lerIdDaRota(event, 'id')
  const body = await lerBodyValidado(event, esquemaAdicionarPericia)

  try {
    const personagemPericia = await prisma.personagemPericia.create({
      data: {
        personagemId: personagemId,
        periciaId: body.periciaId,
        treino: body.treino ?? 'LEIGO',
      },
      include: { pericia: true },
    })

    return personagemPericia
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Essa perícia já foi adicionada a essa ficha.',
      })
    }
    throw e
  }
})
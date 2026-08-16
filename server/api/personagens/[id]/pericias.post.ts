import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const personagemId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const personagemPericia = await prisma.personagemPericia.create({
    data: {
      personagemId: personagemId!,
      periciaId: body.periciaId,
      treino: body.treino ?? 'LEIGO',
    },
    include: { pericia: true },
  })

  return personagemPericia
})
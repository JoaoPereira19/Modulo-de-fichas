import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const personagemPericiaId = getRouterParam(event, 'personagemPericiaId')
  const body = await readBody(event)

  const atualizado = await prisma.personagemPericia.update({
    where: { id: personagemPericiaId },
    data: { treino: body.treino },
    include: { pericia: true },
  })

  return atualizado
})
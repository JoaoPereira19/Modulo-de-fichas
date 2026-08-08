import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Por enquanto, sem autenticação ainda (Fase 3), pegamos todas as fichas
  const personagens = await prisma.personagem.findMany({
    include: {
      pericias: { include: { pericia: true } },
    },
    orderBy: { criadoEm: 'desc' },
  })

  return personagens
})
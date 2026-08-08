import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const personagem = await prisma.personagem.create({
    data: {
      nome: body.nome,
      classe: body.classe,
      trilha: body.trilha ?? null,
      agilidade: body.agilidade ?? 1,
      forca: body.forca ?? 1,
      intelecto: body.intelecto ?? 1,
      presenca: body.presenca ?? 1,
      vigor: body.vigor ?? 1,
      usuarioId: body.usuarioId, // por enquanto vem do front, até termos login (Fase 3)
    },
  })

  return personagem
})
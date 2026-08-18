import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const personagem = await prisma.personagem.create({
    data: {
      nome: body.nome,
      classe: body.classe,
      origem: body.origem ?? null,
      trilha: body.trilha ?? null,
      agilidade: body.agilidade ?? 1,
      forca: body.forca ?? 1,
      intelecto: body.intelecto ?? 1,
      presenca: body.presenca ?? 1,
      vigor: body.vigor ?? 1,
      usuarioId: body.usuarioId,
    },
  })

  // Adiciona automaticamente todas as perícias oficiais, como LEIGO
  const periciasOficiais = await prisma.pericia.findMany({
    where: { origem: 'OFICIAL' },
  })

  await prisma.personagemPericia.createMany({
    data: periciasOficiais.map((pericia) => ({
      personagemId: personagem.id,
      periciaId: pericia.id,
      treino: 'LEIGO',
    })),
  })

  return personagem
})
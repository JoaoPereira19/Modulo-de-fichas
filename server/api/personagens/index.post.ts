import { prisma } from '../../utils/prisma'
import { calcularRecursosMaximos } from '../../utils/calcularRecursos'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const nex = body.nex ?? 5
  const vigor = body.vigor ?? 1
  const presenca = body.presenca ?? 1

  const { pvMaximo, peMaximo, sanidadeMaxima } = calcularRecursosMaximos(
    body.classe, nex, vigor, presenca
  )

  const personagem = await prisma.personagem.create({
    data: {
      nome: body.nome,
      classe: body.classe,
      origemId: body.origemId ?? null,
      trilha: body.trilha ?? null,
      nex,
      agilidade: body.agilidade ?? 1,
      forca: body.forca ?? 1,
      intelecto: body.intelecto ?? 1,
      presenca,
      vigor,
      pvAtual: pvMaximo,
      peAtual: peMaximo,
      sanidadeAtual: sanidadeMaxima,
      usuarioId: body.usuarioId,
    },
  })

  const periciasOficiais = await prisma.pericia.findMany({ where: { origem: 'OFICIAL' } })
  await prisma.personagemPericia.createMany({
    data: periciasOficiais.map((p) => ({
      personagemId: personagem.id,
      periciaId: p.id,
      treino: 'LEIGO',
    })),
  })

  return personagem
})
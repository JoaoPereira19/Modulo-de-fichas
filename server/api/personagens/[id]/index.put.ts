import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const personagem = await prisma.personagem.update({
    where: { id },
    data: {
      nome: body.nome,
      origem: body.origem,
      classe: body.classe,
      trilha: body.trilha,
      agilidade: body.agilidade,
      forca: body.forca,
      intelecto: body.intelecto,
      presenca: body.presenca,
      vigor: body.vigor,
      pvAtual: body.pvAtual,
      peAtual: body.peAtual,
      sanidadeAtual: body.sanidadeAtual,
    },
  })

  return personagem
})
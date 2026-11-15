import { prisma } from '../utils/prisma'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const usuarioId = await obterUsuarioAtualId()

  const item = await prisma.item.create({
    data: {
      nome: body.nome,
      descricao: body.descricao || null,
      categoria: body.categoria || null,
      espacos: body.espacos ?? 1,
      dano: body.dano || null,
      critico: body.critico || null,
      alcance: body.alcance || null,
      tipoDano: body.tipoDano || null,
      origem: 'CUSTOMIZADO',
      criadoPorId: usuarioId,
    },
  })

  return item
})
import { prisma } from '../utils/prisma'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const usuarioId = await obterUsuarioAtualId()

  const pericia = await prisma.pericia.create({
    data: {
      nome: body.nome,
      atributoBase: body.atributoBase,
      soTreinada: body.soTreinada ?? false,
      carga: body.carga ?? false,
      kit: body.kit ?? false,
      origem: 'CUSTOMIZADO',
      criadoPorId: usuarioId,
    },
  })

  return pericia
})
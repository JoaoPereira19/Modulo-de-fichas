import { prisma } from '../utils/prisma'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const usuarioId = await obterUsuarioAtualId()

  const ritual = await prisma.ritual.create({
    data: {
      nome: body.nome,
      circulo: body.circulo,
      elemento: body.elemento,
      custoPE: body.custoPE,
      descricao: body.descricao,
      origem: 'CUSTOMIZADO',
      criadoPorId: usuarioId,
    },
  })

  return ritual
})
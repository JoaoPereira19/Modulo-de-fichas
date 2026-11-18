import { prisma } from '../utils/prisma'
import { lerBodyValidado } from '../utils/validacao'
import { esquemaCriarRitual } from '../utils/esquemas'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default defineEventHandler(async (event) => {
  const body = await lerBodyValidado(event, esquemaCriarRitual)
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
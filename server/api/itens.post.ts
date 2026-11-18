import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'
import { lerBodyValidado } from '../utils/validacao'
import { esquemaCriarItem } from '../utils/esquemas'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default definirRota(async (event) => {
  const body = await lerBodyValidado(event, esquemaCriarItem)
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
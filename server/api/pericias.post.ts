import { prisma } from '../utils/prisma'
import { definirRota } from '../utils/erros'
import { lerBodyValidado } from '../utils/validacao'
import { esquemaCriarPericia } from '../utils/esquemas'
import { obterUsuarioAtualId } from '../utils/usuarioAtual'

export default definirRota(async (event) => {
  const body = await lerBodyValidado(event, esquemaCriarPericia)
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
}, {
  P2002: 'Já existe uma perícia com esse nome.',
})
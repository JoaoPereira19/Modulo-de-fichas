import { prisma } from '../../../utils/prisma'
import { lerBodyValidado, lerIdDaRota } from '../../../utils/validacao'
import { esquemaEditarPersonagem } from '../../../utils/esquemas'

export default defineEventHandler(async (event) => {
  const id = lerIdDaRota(event, 'id')

  // Só chegam aqui dados no formato certo; campos com nome desconhecido já foram recusados com 400.
  const dados = await lerBodyValidado(event, esquemaEditarPersonagem)

  const personagem = await prisma.personagem.update({
    where: { id },
    data: dados,
  })

  return personagem
})

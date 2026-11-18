import { prisma } from '../../../utils/prisma'
import { definirRota } from '../../../utils/erros'
import { lerBodyValidado, lerIdDaRota } from '../../../utils/validacao'
import { esquemaEditarPersonagem } from '../../../utils/esquemas'

export default definirRota(async (event) => {
  const id = lerIdDaRota(event, 'id')

  // Só chegam aqui dados no formato certo; campos com nome desconhecido já foram recusados com 400.
  const dados = await lerBodyValidado(event, esquemaEditarPersonagem)

  const personagem = await prisma.personagem.update({
    where: { id },
    data: dados,
  })

  return personagem
}, {
  P2025: 'Ficha não encontrada.',
})

import { prisma } from '../../../utils/prisma'
import { definirRota } from '../../../utils/erros'
import { lerIdDaRota } from '../../../utils/validacao'

export default definirRota(async (event) => {
  const id = lerIdDaRota(event, 'id')

  // No MongoDB o Prisma não deixa apagar uma ficha que ainda tem "filhos"
  // (perícias, rituais, itens, habilidades). Então apagamos os filhos primeiro.
  // O $transaction garante que é tudo ou nada: se uma etapa falhar, nada é apagado.
  await prisma.$transaction([
    prisma.personagemPericia.deleteMany({ where: { personagemId: id } }),
    prisma.personagemRitual.deleteMany({ where: { personagemId: id } }),
    prisma.personagemItem.deleteMany({ where: { personagemId: id } }),
    prisma.habilidade.deleteMany({ where: { personagemId: id } }),
    prisma.personagem.delete({ where: { id } }),
  ])

  return { sucesso: true }
}, {
  P2025: 'Ficha não encontrada.',
})

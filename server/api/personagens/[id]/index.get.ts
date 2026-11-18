import { prisma } from '../../../utils/prisma'
import { definirRota, erroHttp } from '../../../utils/erros'
import { lerIdDaRota } from '../../../utils/validacao'
import { calcularRecursosMaximos, calcularCarga, calcularDefesa, calcularDeslocamento } from '#shared/utils/calcularRecursos'

export default definirRota(async (event) => {
  const id = lerIdDaRota(event, 'id')

  const personagem = await prisma.personagem.findUnique({
  where: { id },
  include: {
    origem: true,
    pericias: { include: { pericia: true } },
    rituais: { include: { ritual: true } },
    itens: { include: { item: true } },
  },
})

  if (!personagem) {
    throw erroHttp(404, 'Ficha não encontrada.')
  }

  const recursos = calcularRecursosMaximos(
    personagem.classe,
    personagem.nex,
    personagem.vigor,
    personagem.presenca
  )

  const carga = calcularCarga(
    personagem.forca,
    personagem.itens.map((pi) => ({ espacos: pi.item.espacos, quantidade: pi.quantidade }))
  )

  const defesa = calcularDefesa(personagem.agilidade)
  const deslocamento = calcularDeslocamento(carga.status)

  return { ...personagem, ...recursos, carga, defesa, deslocamento }
})
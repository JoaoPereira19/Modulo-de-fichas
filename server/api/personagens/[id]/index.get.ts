import { prisma } from '../../../utils/prisma'
import { calcularRecursosMaximos, calcularCarga, calcularDefesa, calcularDeslocamento } from '../../../utils/calcularRecursos'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

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
    throw createError({ statusCode: 404, statusMessage: 'Ficha não encontrada' })
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
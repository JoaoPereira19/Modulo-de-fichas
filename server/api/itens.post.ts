import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

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
      criadoPorId: 'usuario-teste-01',
    },
  })

  return item
})
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const pericia = await prisma.pericia.create({
    data: {
      nome: body.nome,
      atributoBase: body.atributoBase,
      soTreinada: body.soTreinada ?? false,
      carga: body.carga ?? false,
      kit: body.kit ?? false,
      origem: 'CUSTOMIZADO',
      criadoPorId: 'usuario-teste-01', // temporário, até termos login (Fase 3)
    },
  })

  return pericia
})
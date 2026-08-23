import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const ritual = await prisma.ritual.create({
    data: {
      nome: body.nome,
      circulo: body.circulo,
      elemento: body.elemento,
      custoPE: body.custoPE,
      descricao: body.descricao,
      origem: 'CUSTOMIZADO',
      criadoPorId: 'usuario-teste-01',
    },
  })

  return ritual
})
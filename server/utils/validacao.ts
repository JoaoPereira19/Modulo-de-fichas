import type { H3Event } from 'h3'
import { z } from 'zod'

// Mensagens padrão do zod em português (usadas quando o esquema não define uma própria).
z.config(z.locales.pt())

// Junta os problemas encontrados numa frase só, ex.: "nex: o NEX vai de 5 a 99."
function descreverProblemas(erro: z.ZodError) {
  return erro.issues
    .map((p) => (p.path.length ? `${p.path.join('.')}: ${p.message}` : p.message))
    .join(' | ')
}

// Lê o corpo da requisição e confere se ele segue o esquema.
// Se não seguir, responde 400 com a explicação, em vez de deixar o erro passar em silêncio.
export async function lerBodyValidado<T extends z.ZodType>(event: H3Event, esquema: T): Promise<z.output<T>> {
  const body = await readBody(event)
  const resultado = esquema.safeParse(body ?? {})

  if (!resultado.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Dados inválidos. ${descreverProblemas(resultado.error)}`,
    })
  }

  return resultado.data
}

// Lê um parâmetro da URL (ex.: o [id] de /api/personagens/[id]) e confere se é um ObjectId do MongoDB.
// Sem isso, um id malformado chegaria ao Prisma e viraria um erro 500 confuso.
export function lerIdDaRota(event: H3Event, nome: string) {
  const valor = getRouterParam(event, nome)

  if (!valor || !/^[0-9a-f]{24}$/i.test(valor)) {
    throw createError({ statusCode: 400, statusMessage: `O parâmetro "${nome}" não é um id válido.` })
  }

  return valor
}

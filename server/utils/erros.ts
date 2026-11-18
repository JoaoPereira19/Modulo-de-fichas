import { Prisma } from '@prisma/client'
import type { H3Event } from 'h3'

// Tratamento de erros num lugar só.
//
// Em vez de cada rota ter seu próprio try/catch, as rotas usam definirRota(...) no lugar de
// defineEventHandler(...). Se o Prisma der um erro conhecido, ele vira uma resposta HTTP
// com status certo e mensagem em português, em vez de um 500 genérico.

// Códigos de erro do Prisma que sabemos traduzir.
// Lista completa: https://www.prisma.io/docs/orm/reference/error-reference
type CodigoPrisma = 'P2002' | 'P2025' | 'P2003' | 'P2014' | 'P2023'

const TRADUCOES: Record<CodigoPrisma, { status: number; mensagem: string }> = {
  P2002: { status: 409, mensagem: 'Esse registro já existe.' }, // violou um @unique
  P2025: { status: 404, mensagem: 'Registro não encontrado.' }, // update/delete de algo que não existe
  P2003: { status: 409, mensagem: 'Esse registro está ligado a outro e não pode ser alterado.' },
  P2014: { status: 409, mensagem: 'Esse registro está ligado a outro e não pode ser alterado.' },
  P2023: { status: 400, mensagem: 'Id em formato inválido.' },
}

// Cria um erro HTTP. A explicação vai em "message" (o h3 recomenda "statusMessage" só para textos curtos).
export function erroHttp(statusCode: number, mensagem: string) {
  return createError({ statusCode, message: mensagem })
}

// Recebe qualquer erro e devolve um erro HTTP pronto para responder.
function traduzirErro(e: unknown, mensagens: Partial<Record<CodigoPrisma, string>>) {
  // Erros que nós mesmos criamos (ex.: validação, 404 da ficha) já estão prontos.
  if (isError(e)) return e

  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code in TRADUCOES) {
    const codigo = e.code as CodigoPrisma
    const padrao = TRADUCOES[codigo]
    return erroHttp(padrao.status, mensagens[codigo] ?? padrao.mensagem)
  }

  // Erro inesperado: deixa virar 500 e aparecer no terminal, para podermos investigar.
  return e
}

// Use no lugar de defineEventHandler.
// O segundo argumento (opcional) troca a mensagem padrão de um código, ex.:
//   definirRota(async (event) => { ... }, { P2002: 'Esse ritual já foi adicionado a essa ficha.' })
export function definirRota<T>(
  handler: (event: H3Event) => Promise<T>,
  mensagens: Partial<Record<CodigoPrisma, string>> = {},
) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event)
    } catch (e) {
      throw traduzirErro(e, mensagens)
    }
  })
}

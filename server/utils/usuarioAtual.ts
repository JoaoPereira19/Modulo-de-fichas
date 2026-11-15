import { prisma } from './prisma'

// TEMPORÁRIO (até a Fase 3, com login):
// devolve o id do primeiro usuário do banco, que é o usuário de teste criado pelo seed.
// Quando existir autenticação, só esta função muda: ela passará a ler o usuário da sessão.
export async function obterUsuarioAtualId() {
  const usuario = await prisma.usuario.findFirstOrThrow({ select: { id: true } })
  return usuario.id
}

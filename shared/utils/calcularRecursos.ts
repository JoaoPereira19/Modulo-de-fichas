// Regras de Ordem Paranormal usadas tanto pelo servidor (server/) quanto pelas telas (app/).
// Por estar em shared/, existe uma cópia só: mudou aqui, mudou nos dois lados.
// Importe com: import { ... } from '#shared/utils/calcularRecursos'
// Atenção: código em shared/ não pode usar nada exclusivo do servidor (Prisma, banco) nem do navegador.

export type Classe = 'COMBATENTE' | 'ESPECIALISTA' | 'OCULTISTA'

const TABELA_CLASSES = {
  COMBATENTE:   { pvBase: 20, pvPorNex: 4, peBase: 2, pePorNex: 2, sanBase: 12, sanPorNex: 3 },
  ESPECIALISTA: { pvBase: 16, pvPorNex: 3, peBase: 3, pePorNex: 3, sanBase: 16, sanPorNex: 4 },
  OCULTISTA:    { pvBase: 12, pvPorNex: 2, peBase: 4, pePorNex: 4, sanBase: 20, sanPorNex: 5 },
}

// Quantos níveis o personagem ganhou além do inicial (NEX 5%).
// O NEX sobe de 5 em 5 até 95% (18 níveis) e depois vai para 99%, que é um patamar próprio (19 níveis).
export function calcularNiveisGanhos(nex: number) {
  if (nex >= 99) return 19
  return Math.max(0, Math.floor((nex - 5) / 5))
}

export function calcularRecursosMaximos(classe: Classe, nex: number, vigor: number, presenca: number) {
  const regras = TABELA_CLASSES[classe]

  const niveis = calcularNiveisGanhos(nex)

  const pvMaximo = (regras.pvBase + vigor) + niveis * (regras.pvPorNex + vigor)
  const peMaximo = (regras.peBase + presenca) + niveis * (regras.pePorNex + presenca)
  const sanidadeMaxima = regras.sanBase + niveis * regras.sanPorNex

  return { pvMaximo, peMaximo, sanidadeMaxima }
}

export function calcularCarga(forca: number, itens: { espacos: number; quantidade: number }[]) {
  const espacoUsado = itens.reduce((total, i) => total + i.espacos * i.quantidade, 0)

  const limite = forca > 0 ? forca * 5 : 2
  const limiteMaximo = limite * 2

  let status: 'normal' | 'sobrecarregado' | 'excedido' = 'normal'
  if (espacoUsado > limiteMaximo) status = 'excedido'
  else if (espacoUsado > limite) status = 'sobrecarregado'

  return { espacoUsado, limite, limiteMaximo, status }
}

export function calcularDefesa(agilidade: number) {
  return 10 + agilidade
}

export function calcularDeslocamento(statusCarga: 'normal' | 'sobrecarregado' | 'excedido') {
  const base = 9
  return statusCarga === 'normal' ? base : base - 3
}
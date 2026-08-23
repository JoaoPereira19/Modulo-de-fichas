type Classe = 'COMBATENTE' | 'ESPECIALISTA' | 'OCULTISTA'

const TABELA_CLASSES = {
  COMBATENTE:   { pvBase: 20, pvPorNex: 4, peBase: 2, pePorNex: 2, sanBase: 12, sanPorNex: 3 },
  ESPECIALISTA: { pvBase: 16, pvPorNex: 3, peBase: 3, pePorNex: 3, sanBase: 16, sanPorNex: 4 },
  OCULTISTA:    { pvBase: 12, pvPorNex: 2, peBase: 4, pePorNex: 4, sanBase: 20, sanPorNex: 5 },
}

export function calcularRecursosMaximos(classe: Classe, nex: number, vigor: number, presenca: number) {
  const regras = TABELA_CLASSES[classe]

  const niveis = Math.max(0, Math.floor((nex - 5) / 5))

  const pvMaximo = (regras.pvBase + vigor) + niveis * (regras.pvPorNex + vigor)
  const peMaximo = (regras.peBase + presenca) + niveis * (regras.pePorNex + presenca)
  const sanidadeMaxima = regras.sanBase + niveis * regras.sanPorNex

  return { pvMaximo, peMaximo, sanidadeMaxima }
}
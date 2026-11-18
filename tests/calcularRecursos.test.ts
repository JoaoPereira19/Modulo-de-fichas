// Testes automáticos das regras de Ordem Paranormal.
// Rodar: pnpm test        (uma vez)
//        pnpm test:watch  (fica rodando e repete a cada arquivo salvo)
//
// Cada "it" é um caso: chama a função com valores conhecidos e confere (expect) o resultado.
// Os valores esperados vêm da tabela do livro (também resumida no CLAUDE.md, seção 5).

import { describe, it, expect } from 'vitest'
import {
  calcularNiveisGanhos,
  calcularRecursosMaximos,
  calcularCarga,
  calcularDefesa,
  calcularDeslocamento,
} from '../shared/utils/calcularRecursos'

describe('calcularNiveisGanhos', () => {
  it('NEX 5 não tem níveis ganhos; cada 5% soma um', () => {
    expect(calcularNiveisGanhos(5)).toBe(0)
    expect(calcularNiveisGanhos(10)).toBe(1)
    expect(calcularNiveisGanhos(14)).toBe(1)
    expect(calcularNiveisGanhos(95)).toBe(18)
  })

  it('NEX 99 é o patamar final: 19 níveis', () => {
    expect(calcularNiveisGanhos(99)).toBe(19)
  })
})

describe('calcularRecursosMaximos', () => {
  describe('Combatente (PV 20+Vig, +4+Vig | PE 2+Pre, +2+Pre | SAN 12, +3)', () => {
    it('NEX 5, Vigor 1, Presença 1', () => {
      expect(calcularRecursosMaximos('COMBATENTE', 5, 1, 1)).toEqual({ pvMaximo: 21, peMaximo: 3, sanidadeMaxima: 12 })
    })

    it('NEX 10, Vigor 1, Presença 1 (exemplo do CLAUDE.md: PV 26)', () => {
      expect(calcularRecursosMaximos('COMBATENTE', 10, 1, 1)).toEqual({ pvMaximo: 26, peMaximo: 6, sanidadeMaxima: 15 })
    })

    it('NEX 20, Vigor 3, Presença 1', () => {
      expect(calcularRecursosMaximos('COMBATENTE', 20, 3, 1)).toEqual({ pvMaximo: 44, peMaximo: 12, sanidadeMaxima: 21 })
    })
  })

  describe('Especialista (PV 16+Vig, +3+Vig | PE 3+Pre, +3+Pre | SAN 16, +4)', () => {
    it('NEX 5, Vigor 2, Presença 3', () => {
      expect(calcularRecursosMaximos('ESPECIALISTA', 5, 2, 3)).toEqual({ pvMaximo: 18, peMaximo: 6, sanidadeMaxima: 16 })
    })

    it('NEX 20, Vigor 2, Presença 3', () => {
      expect(calcularRecursosMaximos('ESPECIALISTA', 20, 2, 3)).toEqual({ pvMaximo: 33, peMaximo: 24, sanidadeMaxima: 28 })
    })
  })

  describe('Ocultista (PV 12+Vig, +2+Vig | PE 4+Pre, +4+Pre | SAN 20, +5)', () => {
    it('NEX 5, Vigor 0, Presença 2', () => {
      expect(calcularRecursosMaximos('OCULTISTA', 5, 0, 2)).toEqual({ pvMaximo: 12, peMaximo: 6, sanidadeMaxima: 20 })
    })

    it('NEX 50, Vigor 0, Presença 2', () => {
      expect(calcularRecursosMaximos('OCULTISTA', 50, 0, 2)).toEqual({ pvMaximo: 30, peMaximo: 60, sanidadeMaxima: 65 })
    })
  })

  describe('progressão de NEX', () => {
    it('só ganha nível a cada 5%: NEX 9 vale o mesmo que NEX 5', () => {
      expect(calcularRecursosMaximos('COMBATENTE', 9, 1, 1)).toEqual(calcularRecursosMaximos('COMBATENTE', 5, 1, 1))
    })

    it('NEX 95 = 18 níveis ganhos', () => {
      // 21 + 18 × (4 + 1) = 111
      expect(calcularRecursosMaximos('COMBATENTE', 95, 1, 1).pvMaximo).toBe(111)
    })

    it('NEX 99 é o último patamar e conta como mais um nível (19 níveis ganhos)', () => {
      // No livro o NEX sobe de 5 em 5 até 95% e depois vai para 99%, que é um patamar próprio.
      // 21 + 19 × (4 + 1) = 116
      expect(calcularRecursosMaximos('COMBATENTE', 99, 1, 1).pvMaximo).toBe(116)
    })
  })
})

describe('calcularCarga', () => {
  it('limite = 5 × Força, e o máximo é o dobro', () => {
    expect(calcularCarga(3, [])).toEqual({ espacoUsado: 0, limite: 15, limiteMaximo: 30, status: 'normal' })
  })

  it('Força 0 tem limite 2', () => {
    expect(calcularCarga(0, []).limite).toBe(2)
  })

  it('soma espaços × quantidade', () => {
    const itens = [{ espacos: 2, quantidade: 3 }, { espacos: 1, quantidade: 1 }]
    expect(calcularCarga(3, itens).espacoUsado).toBe(7)
  })

  it('exatamente no limite ainda é normal; 1 acima fica sobrecarregado', () => {
    expect(calcularCarga(3, [{ espacos: 15, quantidade: 1 }]).status).toBe('normal')
    expect(calcularCarga(3, [{ espacos: 16, quantidade: 1 }]).status).toBe('sobrecarregado')
  })

  it('exatamente no dobro ainda é sobrecarregado; 1 acima é excedido', () => {
    expect(calcularCarga(3, [{ espacos: 30, quantidade: 1 }]).status).toBe('sobrecarregado')
    expect(calcularCarga(3, [{ espacos: 31, quantidade: 1 }]).status).toBe('excedido')
  })
})

describe('calcularDefesa', () => {
  it('Defesa = 10 + Agilidade', () => {
    expect(calcularDefesa(0)).toBe(10)
    expect(calcularDefesa(3)).toBe(13)
  })
})

describe('calcularDeslocamento', () => {
  it('9 m normalmente, 6 m quando sobrecarregado ou excedido', () => {
    expect(calcularDeslocamento('normal')).toBe(9)
    expect(calcularDeslocamento('sobrecarregado')).toBe(6)
    expect(calcularDeslocamento('excedido')).toBe(6)
  })
})

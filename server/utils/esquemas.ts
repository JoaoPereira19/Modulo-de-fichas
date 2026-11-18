import { z } from 'zod'
import { Classe, Treino } from '@prisma/client'

// Esquemas = a "forma" que cada requisição precisa ter.
// Cada rota usa um deles com lerBodyValidado (ver validacao.ts).

// ---------- Peças reutilizáveis ----------

// Id do MongoDB: 24 caracteres hexadecimais.
const objectId = z.string().regex(/^[0-9a-f]{24}$/i, 'id inválido.')

// Texto opcional: aceita string, null ou ausente. String vazia vira null.
const textoOpcional = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v ? v : null))

const atributo = z.number().int().min(0, 'atributos vão de 0 a 5.').max(5, 'atributos vão de 0 a 5.')
const recursoAtual = z.number().int().min(0, 'não pode ser negativo.')

// ---------- Personagem (ficha) ----------

// Campos que podem ser editados. No POST, só nome e classe são obrigatórios.
const camposPersonagem = {
  nome: z.string().trim().min(1, 'o nome é obrigatório.'),
  classe: z.enum(Classe), // usa o enum do próprio schema.prisma: COMBATENTE, ESPECIALISTA, OCULTISTA
  origemId: objectId.nullish(),
  trilha: textoOpcional,
  nex: z.number().int().min(5, 'o NEX vai de 5 a 99.').max(99, 'o NEX vai de 5 a 99.'),
  agilidade: atributo,
  forca: atributo,
  intelecto: atributo,
  presenca: atributo,
  vigor: atributo,
}

export const esquemaCriarPersonagem = z.strictObject({
  ...camposPersonagem,
  nex: camposPersonagem.nex.optional(),
  agilidade: atributo.optional(),
  forca: atributo.optional(),
  intelecto: atributo.optional(),
  presenca: atributo.optional(),
  vigor: atributo.optional(),
})

// Na edição tudo é opcional: o que não vier, não é alterado.
// strictObject: um campo com nome desconhecido (ex.: "origem" em vez de "origemId") vira erro 400.
export const esquemaEditarPersonagem = z
  .strictObject({
    ...camposPersonagem,
    pvAtual: recursoAtual,
    peAtual: recursoAtual,
    sanidadeAtual: recursoAtual,
  })
  .partial()

// ---------- Ligações da ficha com o catálogo ----------

export const esquemaAdicionarPericia = z.strictObject({
  periciaId: objectId,
  treino: z.enum(Treino).optional(),
})

export const esquemaAlterarTreino = z.strictObject({
  treino: z.enum(Treino),
})

export const esquemaAdicionarRitual = z.strictObject({
  ritualId: objectId,
})

export const esquemaAdicionarItem = z.strictObject({
  itemId: objectId,
  quantidade: z.number().int().min(1, 'a quantidade mínima é 1.').optional(),
})

// ---------- Catálogo customizado ----------

export const esquemaCriarPericia = z.strictObject({
  nome: z.string().trim().min(1, 'o nome é obrigatório.'),
  atributoBase: z.enum(['Agilidade', 'Força', 'Intelecto', 'Presença', 'Vigor']),
  soTreinada: z.boolean().optional(),
  carga: z.boolean().optional(),
  kit: z.boolean().optional(),
})

export const esquemaCriarRitual = z.strictObject({
  nome: z.string().trim().min(1, 'o nome é obrigatório.'),
  circulo: z.number().int().min(1, 'o círculo vai de 1 a 4.').max(4, 'o círculo vai de 1 a 4.'),
  elemento: z.enum(['Conhecimento', 'Energia', 'Morte', 'Sangue', 'Medo']),
  custoPE: z.number().int().min(1, 'o custo mínimo é 1 PE.'),
  descricao: z.string().trim().min(1, 'a descrição é obrigatória.'),
})

export const esquemaCriarItem = z.strictObject({
  nome: z.string().trim().min(1, 'o nome é obrigatório.'),
  descricao: textoOpcional,
  categoria: z.enum(['0', 'I', 'II', 'III', 'IV']).nullish(),
  espacos: z.number().int().min(0, 'não pode ser negativo.').optional(),
  dano: textoOpcional,
  critico: textoOpcional,
  alcance: textoOpcional,
  tipoDano: textoOpcional,
})

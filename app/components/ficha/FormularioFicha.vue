<script setup lang="ts">
// Formulário único de ficha, usado por "Nova Ficha" e "Editar Ficha".
// Ele só cuida dos campos. Quem decide o que fazer ao salvar (POST ou PUT) é a página que o usa.
import { calcularRecursosMaximos, calcularDefesa, calcularCarga } from '#shared/utils/calcularRecursos'

export type DadosFicha = {
  nome: string
  classe: 'COMBATENTE' | 'ESPECIALISTA' | 'OCULTISTA'
  origemId: string | null
  trilha: string | null
  nex: number
  agilidade: number
  forca: number
  intelecto: number
  presenca: number
  vigor: number
  pvAtual?: number
  peAtual?: number
  sanidadeAtual?: number
}

// props = dados que a página "de fora" passa para o componente.
const props = defineProps<{
  valoresIniciais?: Partial<DadosFicha>
  mostrarRecursos?: boolean // PV/PE/SAN atuais só fazem sentido na edição
  textoBotao: string
  erro?: string
}>()

// emit = avisar a página "de fora" que algo aconteceu, entregando os dados.
const emit = defineEmits<{
  salvar: [dados: DadosFicha]
}>()

const { data: origensDisponiveis } = await useFetch('/api/origens')

// Copiamos os valores iniciais para um objeto próprio do formulário.
// Assim o componente edita a cópia e nunca altera diretamente o que veio por props.
const v = props.valoresIniciais ?? {}
const form = ref({
  nome: v.nome ?? '',
  classe: v.classe ?? 'COMBATENTE',
  origemId: v.origemId ?? '',
  trilha: v.trilha ?? '',
  nex: v.nex ?? 5,
  agilidade: v.agilidade ?? 1,
  forca: v.forca ?? 1,
  intelecto: v.intelecto ?? 1,
  presenca: v.presenca ?? 1,
  vigor: v.vigor ?? 1,
  pvAtual: v.pvAtual ?? 0,
  peAtual: v.peAtual ?? 0,
  sanidadeAtual: v.sanidadeAtual ?? 0,
})

// computed = valor calculado a partir de outros. O Vue refaz a conta sozinho sempre que
// algum valor usado lá dentro muda (classe, NEX, Vigor...), e a tela se atualiza na hora.
// São as mesmas funções que o servidor usa, vindas de shared/.
const previa = computed(() => {
  const f = form.value
  // Campo numérico apagado vira "" no v-model; Number("") é 0. O NEX volta a 5 nesse caso.
  const nex = Number(f.nex) || 5

  return {
    ...calcularRecursosMaximos(f.classe, nex, Number(f.vigor), Number(f.presenca)),
    defesa: calcularDefesa(Number(f.agilidade)),
    limiteCarga: calcularCarga(Number(f.forca), []).limite,
  }
})

// Lista usada para desenhar os 5 campos de atributo com um v-for, em vez de repetir 5 blocos.
const atributos = [
  { campo: 'agilidade', rotulo: 'Agilidade' },
  { campo: 'forca', rotulo: 'Força' },
  { campo: 'intelecto', rotulo: 'Intelecto' },
  { campo: 'presenca', rotulo: 'Presença' },
  { campo: 'vigor', rotulo: 'Vigor' },
] as const

function enviar() {
  const f = form.value

  const dados: DadosFicha = {
    nome: f.nome,
    classe: f.classe,
    origemId: f.origemId || null, // "" (opção "Nenhuma") vira null
    trilha: f.trilha || null,
    nex: f.nex,
    agilidade: f.agilidade,
    forca: f.forca,
    intelecto: f.intelecto,
    presenca: f.presenca,
    vigor: f.vigor,
  }

  if (props.mostrarRecursos) {
    dados.pvAtual = f.pvAtual
    dados.peAtual = f.peAtual
    dados.sanidadeAtual = f.sanidadeAtual
  }

  emit('salvar', dados)
}
</script>

<template>
  <form @submit.prevent="enviar">
    <div>
      <label>Nome</label>
      <input v-model="form.nome" required />
    </div>

    <div>
      <label>Origem</label>
      <select v-model="form.origemId">
        <option value="">Nenhuma</option>
        <option v-for="o in origensDisponiveis" :key="o.id" :value="o.id">
          {{ o.nome }}
        </option>
      </select>
    </div>

    <div>
      <label>Classe</label>
      <select v-model="form.classe">
        <option value="COMBATENTE">Combatente</option>
        <option value="ESPECIALISTA">Especialista</option>
        <option value="OCULTISTA">Ocultista</option>
      </select>
    </div>

    <div>
      <label>Trilha</label>
      <input v-model="form.trilha" />
    </div>

    <div>
      <label>NEX (%)</label>
      <input v-model.number="form.nex" type="number" min="5" max="99" />
    </div>

    <h2>Atributos</h2>
    <div v-for="a in atributos" :key="a.campo">
      <label>{{ a.rotulo }}</label>
      <input v-model.number="form[a.campo]" type="number" min="0" max="5" />
    </div>

    <h2>Prévia</h2>
    <ul>
      <li>PV máximo: {{ previa.pvMaximo }}</li>
      <li>PE máximo: {{ previa.peMaximo }}</li>
      <li>Sanidade máxima: {{ previa.sanidadeMaxima }}</li>
      <li>Defesa: {{ previa.defesa }}</li>
      <li>Limite de carga: {{ previa.limiteCarga }} espaços</li>
    </ul>

    <template v-if="mostrarRecursos">
      <h2>Recursos</h2>
      <div>
        <label>PV Atual (máx. {{ previa.pvMaximo }})</label>
        <input v-model.number="form.pvAtual" type="number" min="0" />
      </div>
      <div>
        <label>PE Atual (máx. {{ previa.peMaximo }})</label>
        <input v-model.number="form.peAtual" type="number" min="0" />
      </div>
      <div>
        <label>Sanidade Atual (máx. {{ previa.sanidadeMaxima }})</label>
        <input v-model.number="form.sanidadeAtual" type="number" min="0" />
      </div>
    </template>

    <p v-if="erro" style="color: red">{{ erro }}</p>

    <button type="submit">{{ textoBotao }}</button>
    <!-- slot: espaço onde a página pode colocar algo extra, como o link "Cancelar" -->
    <slot />
  </form>
</template>

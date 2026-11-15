<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const { data: personagem } = await useFetch(`/api/personagens/${route.params.id}`)
const { data: origensDisponiveis } = await useFetch('/api/origens')

const nome = ref(personagem.value?.nome ?? '')
const origemId = ref(personagem.value?.origemId ?? '')
const classe = ref(personagem.value?.classe ?? 'COMBATENTE')
const trilha = ref(personagem.value?.trilha ?? '')
const nex = ref(personagem.value?.nex ?? 5)

const agilidade = ref(personagem.value?.agilidade ?? 1)
const forca = ref(personagem.value?.forca ?? 1)
const intelecto = ref(personagem.value?.intelecto ?? 1)
const presenca = ref(personagem.value?.presenca ?? 1)
const vigor = ref(personagem.value?.vigor ?? 1)

const pvAtual = ref(personagem.value?.pvAtual ?? 0)
const peAtual = ref(personagem.value?.peAtual ?? 0)
const sanidadeAtual = ref(personagem.value?.sanidadeAtual ?? 0)

async function salvar() {
  await $fetch(`/api/personagens/${route.params.id}`, {
    method: 'PUT',
    body: {
      nome: nome.value,
      origemId: origemId.value || null,
      classe: classe.value,
      trilha: trilha.value || null,
      nex: nex.value,
      agilidade: agilidade.value,
      forca: forca.value,
      intelecto: intelecto.value,
      presenca: presenca.value,
      vigor: vigor.value,
      pvAtual: pvAtual.value,
      peAtual: peAtual.value,
      sanidadeAtual: sanidadeAtual.value,
    },
  })

  router.push(`/fichas/${route.params.id}`)
}
</script>

<template>
  <div>
    <h1>Editar Ficha</h1>

    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="nome" required />
      </div>

      <div>
        <label>Origem</label>
        <select v-model="origemId">
          <option value="">Nenhuma</option>
          <option v-for="o in origensDisponiveis" :key="o.id" :value="o.id">
            {{ o.nome }}
          </option>
        </select>
      </div>

      <div>
        <label>Classe</label>
        <select v-model="classe">
          <option value="COMBATENTE">Combatente</option>
          <option value="ESPECIALISTA">Especialista</option>
          <option value="OCULTISTA">Ocultista</option>
        </select>
      </div>

      <div>
        <label>Trilha</label>
        <input v-model="trilha" />
      </div>

      <div>
        <label>NEX (%)</label>
        <input v-model.number="nex" type="number" min="5" max="99" />
      </div>

      <h2>Atributos</h2>
      <div>
        <label>Agilidade</label>
        <input v-model.number="agilidade" type="number" min="0" max="5" />
      </div>
      <div>
        <label>Força</label>
        <input v-model.number="forca" type="number" min="0" max="5" />
      </div>
      <div>
        <label>Intelecto</label>
        <input v-model.number="intelecto" type="number" min="0" max="5" />
      </div>
      <div>
        <label>Presença</label>
        <input v-model.number="presenca" type="number" min="0" max="5" />
      </div>
      <div>
        <label>Vigor</label>
        <input v-model.number="vigor" type="number" min="0" max="5" />
      </div>

      <h2>Recursos</h2>
      <div>
        <label>PV Atual</label>
        <input v-model.number="pvAtual" type="number" min="0" />
      </div>
      <div>
        <label>PE Atual</label>
        <input v-model.number="peAtual" type="number" min="0" />
      </div>
      <div>
        <label>Sanidade Atual</label>
        <input v-model.number="sanidadeAtual" type="number" min="0" />
      </div>

      <button type="submit">Salvar</button>
      <NuxtLink :to="`/fichas/${route.params.id}`">Cancelar</NuxtLink>
    </form>
  </div>
</template>

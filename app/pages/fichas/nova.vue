<script setup lang="ts">
const personagensStore = usePersonagensStore()
const router = useRouter()

const nome = ref('')
const origem = ref('')
const classe = ref('COMBATENTE')
const trilha = ref('')

const agilidade = ref(1)
const forca = ref(1)
const intelecto = ref(1)
const presenca = ref(1)
const vigor = ref(1)

async function salvar() {
  const novo = await personagensStore.criarPersonagem({
    nome: nome.value,
    classe: classe.value,
    origem: origem.value || null,
    trilha: trilha.value || null,
    agilidade: agilidade.value,
    forca: forca.value,
    intelecto: intelecto.value,
    presenca: presenca.value,
    vigor: vigor.value,
  })

  router.push(`/fichas/${novo.id}`)
}
</script>

<template>
  <div>
    <h1>Nova Ficha</h1>

    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="nome" required />
      </div>
      
      <div>
        <label>Origem</label>
        <input v-model="origem" />
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

      <button type="submit">Criar Ficha</button>
    </form>
  </div>
</template>
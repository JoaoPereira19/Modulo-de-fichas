<script setup lang="ts">
const router = useRouter()

const nome = ref('')
const circulo = ref(1)
const elemento = ref('Conhecimento')
const custoPE = ref(1)
const descricao = ref('')

async function salvar() {
  await $fetch('/api/rituais', {
    method: 'POST',
    body: {
      nome: nome.value,
      circulo: circulo.value,
      elemento: elemento.value,
      custoPE: custoPE.value,
      descricao: descricao.value,
    },
  })

  router.push('/catalogo/novo-ritual')
}
</script>

<template>
  <div>
    <h1>Novo Ritual Customizado</h1>

    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="nome" required />
      </div>

      <div>
        <label>Círculo</label>
        <select v-model.number="circulo">
          <option :value="1">1º</option>
          <option :value="2">2º</option>
          <option :value="3">3º</option>
          <option :value="4">4º</option>
        </select>
      </div>

      <div>
        <label>Elemento</label>
        <select v-model="elemento">
          <option value="Conhecimento">Conhecimento</option>
          <option value="Energia">Energia</option>
          <option value="Morte">Morte</option>
          <option value="Sangue">Sangue</option>
          <option value="Medo">Medo</option>
        </select>
      </div>

      <div>
        <label>Custo de PE</label>
        <input v-model.number="custoPE" type="number" min="1" />
      </div>

      <div>
        <label>Descrição</label>
        <textarea v-model="descricao" required></textarea>
      </div>

      <button type="submit">Criar Ritual</button>
    </form>
  </div>
</template>
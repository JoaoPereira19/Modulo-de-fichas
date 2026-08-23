<script setup lang="ts">
const router = useRouter()

const nome = ref('')
const atributoBase = ref('Agilidade')
const soTreinada = ref(false)
const carga = ref(false)
const kit = ref(false)

async function salvar() {
  await $fetch('/api/pericias', {
    method: 'POST',
    body: {
      nome: nome.value,
      atributoBase: atributoBase.value,
      soTreinada: soTreinada.value,
      carga: carga.value,
      kit: kit.value,
    },
  })

  router.push('/catalogo/nova-pericia')
}
</script>

<template>
  <div>
    <h1>Nova Perícia Customizada</h1>

    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="nome" required />
      </div>

      <div>
        <label>Atributo Base</label>
        <select v-model="atributoBase">
          <option value="Agilidade">Agilidade</option>
          <option value="Força">Força</option>
          <option value="Intelecto">Intelecto</option>
          <option value="Presença">Presença</option>
          <option value="Vigor">Vigor</option>
        </select>
      </div>

      <div>
        <label><input v-model="soTreinada" type="checkbox" /> Só treinada</label>
      </div>
      <div>
        <label><input v-model="carga" type="checkbox" /> Sofre penalidade de carga</label>
      </div>
      <div>
        <label><input v-model="kit" type="checkbox" /> Exige kit</label>
      </div>

      <button type="submit">Criar Perícia</button>
    </form>
  </div>
</template>
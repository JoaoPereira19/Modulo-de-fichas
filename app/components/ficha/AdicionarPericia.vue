<script setup lang="ts">
const props = defineProps<{ personagemId: string }>()
const emit = defineEmits(['adicionada'])

const { data: periciasDisponiveis } = await useFetch('/api/pericias')

const periciaSelecionada = ref('')
const treino = ref('LEIGO')

async function adicionar() {
  if (!periciaSelecionada.value) return

  const nova = await $fetch(`/api/personagens/${props.personagemId}/pericias`, {
    method: 'POST',
    body: {
      periciaId: periciaSelecionada.value,
      treino: treino.value,
    },
  })

  emit('adicionada', nova)
  periciaSelecionada.value = ''
  treino.value = 'LEIGO'
}
</script>

<template>
  <div>
    <select v-model="periciaSelecionada">
      <option value="" disabled>Escolha uma perícia</option>
      <option v-for="p in periciasDisponiveis" :key="p.id" :value="p.id">
        {{ p.nome }}
      </option>
    </select>

    <select v-model="treino">
      <option value="LEIGO">Leigo</option>
      <option value="TREINADO">Treinado</option>
      <option value="VETERANO">Veterano</option>
      <option value="EXPERT">Expert</option>
    </select>

    <button @click="adicionar">Adicionar</button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ personagemId: string }>()
const emit = defineEmits(['adicionada'])

const { data: periciasDisponiveis } = await useFetch('/api/pericias')

const periciaSelecionada = ref('')
const treino = ref('LEIGO')
const erro = ref('')

async function adicionar() {
  if (!periciaSelecionada.value) return
  erro.value = ''

  try {
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
  } catch (e: any) {
    erro.value = e.statusMessage || e.data?.statusMessage || 'Erro ao adicionar perícia.'
  }
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

    <p v-if="erro" style="color: red">{{ erro }}</p>
  </div>
</template>
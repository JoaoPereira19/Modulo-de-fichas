<script setup lang="ts">
const props = defineProps<{ personagemId: string }>()
const emit = defineEmits(['adicionado'])

const { data: rituaisDisponiveis } = await useFetch('/api/rituais')

const ritualSelecionado = ref('')
const erro = ref('')

async function adicionar() {
  if (!ritualSelecionado.value) return
  erro.value = ''

  try {
    const novo = await $fetch(`/api/personagens/${props.personagemId}/rituais`, {
      method: 'POST',
      body: { ritualId: ritualSelecionado.value },
    })

    emit('adicionado', novo)
    ritualSelecionado.value = ''
  } catch (e: any) {
    erro.value = e.statusMessage || e.data?.statusMessage || 'Erro ao adicionar ritual.'
  }
}
</script>

<template>
  <div>
    <select v-model="ritualSelecionado">
      <option value="" disabled>Escolha um ritual</option>
      <option v-for="r in rituaisDisponiveis" :key="r.id" :value="r.id">
        {{ r.nome }} ({{ r.elemento }}, {{ r.circulo }}º círculo)
      </option>
    </select>

    <button @click="adicionar">Adicionar</button>

    <p v-if="erro" style="color: red">{{ erro }}</p>
  </div>
</template>
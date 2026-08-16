<script setup lang="ts">
const props = defineProps<{ personagemId: string }>()
const emit = defineEmits(['adicionado'])

const { data: itensDisponiveis } = await useFetch('/api/itens')

const itemSelecionado = ref('')
const quantidade = ref(1)
const erro = ref('')

async function adicionar() {
  if (!itemSelecionado.value) return
  erro.value = ''

  try {
    const novo = await $fetch(`/api/personagens/${props.personagemId}/itens`, {
      method: 'POST',
      body: {
        itemId: itemSelecionado.value,
        quantidade: quantidade.value,
      },
    })

    emit('adicionado', novo)
    itemSelecionado.value = ''
    quantidade.value = 1
  } catch (e: any) {
    erro.value = e.statusMessage || e.data?.statusMessage || 'Erro ao adicionar item.'
  }
}
</script>

<template>
  <div>
    <select v-model="itemSelecionado">
      <option value="" disabled>Escolha um item</option>
      <option v-for="i in itensDisponiveis" :key="i.id" :value="i.id">
        {{ i.nome }}
      </option>
    </select>

    <input v-model.number="quantidade" type="number" min="1" />

    <button @click="adicionar">Adicionar</button>

    <p v-if="erro" style="color: red">{{ erro }}</p>
  </div>
</template>
<script setup lang="ts">
const personagensStore = usePersonagensStore()

onMounted(() => {
  personagensStore.buscarPersonagens()
})

async function excluir(id: string) {
  if (confirm('Tem certeza que quer excluir essa ficha?')) {
    await personagensStore.deletarPersonagem(id)
  }
}
</script>

<template>
  <div>
    <h1>Minhas Fichas</h1>
    <NuxtLink to="/fichas/nova">+ Nova Ficha</NuxtLink>

    <div v-if="personagensStore.carregando">Carregando...</div>
    <ul v-else>
      <li v-for="personagem in personagensStore.lista" :key="personagem.id">
        <NuxtLink :to="`/fichas/${personagem.id}`">
          {{ personagem.nome }} — {{ personagem.classe }} (NEX {{ personagem.nex }}%)
        </NuxtLink>
        <button @click="excluir(personagem.id)">Excluir</button>
      </li>
    </ul>
  </div>
</template>
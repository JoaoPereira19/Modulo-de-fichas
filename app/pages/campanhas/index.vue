<script setup>

const campanhasStore = useCampanhasStore()

onMounted(() => {
  campanhasStore.buscarCampanhas()
})

</script>

<template>
  <div v-if="campanhasStore.carregando">Carregando...</div>
  <div v-else>
    <p>Total de campanhas: {{ campanhasStore.totalCampanhas }}</p>
    
    <NuxtLink
      v-for="campanha in campanhasStore.lista"
      :key="campanha.id"
      :to="`/campanha/${campanha.id}`"
    >
      {{ campanha.nome }}
    </NuxtLink>
  </div>
</template>
<script setup>

const { data: campanhas, pending, error } = await useFetch('/api/campanhas')

</script>

<template>
  <div v-if="pending">Carregando...</div>
  <div v-else-if="error">Erro ao carregar campanhas.</div>
  <div v-else>
    <NuxtLink
      v-for="campanha in campanhas"
      :key="campanha.id"
      :to="`/campanha/${campanha.id}`"
    >
      {{ campanha.nome }}
    </NuxtLink>
  </div>
</template>
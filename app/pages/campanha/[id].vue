<script setup>

const route = useRoute()
const {data: campanha} = await useFetch(`/api/campanhas/${route.params.id}`)
</script>

<template>
    <h1 v-if="pending">Carregando...</h1>
    <h1 v-else-if="error">Erro ao carregar campanha.</h1>
    <h1 v-else>{{ campanha.nome }}</h1>
</template>
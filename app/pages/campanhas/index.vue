<script setup>

const campanhas = ref([
    { id: 1, name: 'Ecos do Abismo' },
    { id: 2, name: 'Eternidade'},
    { id: 3, name: 'Equação Antivida'},
])

</script>

<template>

    <NuxtLink
    v-for="campanha in campanhas"
    :key="campanha.id"
    :to="`/campanhas/${campanha.id}`"
    >{{ campanha.name }}</NuxtLink>


</template>
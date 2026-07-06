<script setup>

defineProps({
        name: String,
        valor: Number
})

const emit = defineEmits(['aumentar', 'diminuir'])

</script>

<template>
  <div>
    <h2>{{ name }}: {{ valor }}</h2>
    <button @click="emit('diminuir')">-</button>
    <button @click="emit('aumentar')">+</button>
  </div>
</template>
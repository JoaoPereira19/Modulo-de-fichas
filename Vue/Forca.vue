<script setup>
import { ref, computed } from 'vue';

const forca = ref(1);

function aumentarForca() {
    if (forca.value < 5){
        forca.value++;
    }
}

function diminuirForca() {
  if (forca.value > 0) {
    forca.value--;
  }
}

const classificacao = computed(() => {
  if (forca.value == 1) {
    return 'Fraco';
  } else if (forca.value == 2 || forca.value == 3) {
    return 'Mediano';
  } else if (forca.value == 4 || forca.value == 5) {
    return 'Forte';
  }
});

</script>


<template>

    <div>
        <h1>Força: {{ forca }}</h1>
        <button @click="diminuirForca">-</button>
        <button @click="aumentarForca">+</button>
        <p>Classificação: {{ classificacao }}</p>
    </div>

    <p v-if="forca >= 5">Forca no limite</p>

</template>

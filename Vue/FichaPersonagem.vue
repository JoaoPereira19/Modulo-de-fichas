<script setup>
import { ref } from 'vue';
import AtributoCard from './AtributoCard.vue';

const atributos = ref([
  { nome: 'Agilidade', valor: 1 },
  { nome: 'Força', valor: 1 },
  { nome: 'Intelecto', valor: 1 },
  { nome: 'Presença', valor: 1 },
  { nome: 'Vigor', valor: 1 },
])

function aumentar(atributo) {
  if (atributo.valor < 5) {
    atributo.valor++;
  }
}

function diminuir(atributo) {
  if (atributo.valor > 0) {
    atributo.valor--;
  }
}
</script>

<template>
    <div>
        <h1>Ficha do Personagem</h1>
        <AtributoCard
        v-for="atributo in atributos"
        :key="atributo.nome"
        :name="atributo.nome"
        :valor="atributo.valor"
        @aumentar="aumentar(atributo)"
        @diminuir="diminuir(atributo)"
        />
    </div>

</template>
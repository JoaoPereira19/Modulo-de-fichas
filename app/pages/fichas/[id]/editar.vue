<script setup lang="ts">
import type { DadosFicha } from '~/components/ficha/FormularioFicha.vue'

const route = useRoute()
const router = useRouter()

const { data: personagem } = await useFetch(`/api/personagens/${route.params.id}`)

const erro = ref('')

async function salvar(dados: DadosFicha) {
  erro.value = ''

  try {
    await $fetch(`/api/personagens/${route.params.id}`, {
      method: 'PUT',
      body: dados,
    })
    router.push(`/fichas/${route.params.id}`)
  } catch (e: any) {
    // O servidor devolve 400 com a explicação quando algum campo é inválido.
    erro.value = mensagemDeErro(e, 'Erro ao salvar a ficha.')
  }
}
</script>

<template>
  <div>
    <h1>Editar Ficha</h1>

    <p v-if="!personagem">Ficha não encontrada.</p>

    <FormularioFicha
      v-else
      :valores-iniciais="personagem"
      mostrar-recursos
      texto-botao="Salvar"
      :erro="erro"
      @salvar="salvar"
    >
      <NuxtLink :to="`/fichas/${route.params.id}`">Cancelar</NuxtLink>
    </FormularioFicha>
  </div>
</template>

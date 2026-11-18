<script setup lang="ts">
import type { DadosFicha } from '~/components/ficha/FormularioFicha.vue'

const personagensStore = usePersonagensStore()
const router = useRouter()

const erro = ref('')

async function criar(dados: DadosFicha) {
  erro.value = ''

  try {
    const novo = await personagensStore.criarPersonagem(dados)
    router.push(`/fichas/${novo.id}`)
  } catch (e: any) {
    // O servidor devolve 400 com a explicação quando algum campo é inválido.
    erro.value = e.data?.statusMessage || e.statusMessage || 'Erro ao criar a ficha.'
  }
}
</script>

<template>
  <div>
    <h1>Nova Ficha</h1>

    <FormularioFicha texto-botao="Criar Ficha" :erro="erro" @salvar="criar">
      <NuxtLink to="/fichas">Cancelar</NuxtLink>
    </FormularioFicha>
  </div>
</template>

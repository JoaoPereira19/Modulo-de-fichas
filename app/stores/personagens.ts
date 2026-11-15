export const usePersonagensStore = defineStore('personagens', () => {
 const lista = ref<any[]>([])
  const carregando = ref(false)

  async function buscarPersonagens() {
    carregando.value = true
    lista.value = await $fetch('/api/personagens')
    carregando.value = false
  }

  async function criarPersonagem(dados: any) {
  const novo = await $fetch('/api/personagens', {
    method: 'POST',
    body: dados, // o servidor decide qual é o usuário (ver server/utils/usuarioAtual.ts)
  })
  lista.value.push(novo)
  return novo
}

  async function deletarPersonagem(id: string) {
    await $fetch(`/api/personagens/${id}`, { method: 'DELETE' })
    lista.value = lista.value.filter((p: any) => p.id !== id)
  }

  return { lista, carregando, buscarPersonagens, criarPersonagem, deletarPersonagem }
})
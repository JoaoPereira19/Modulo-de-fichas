<script setup lang="ts">
const router = useRouter()

const nome = ref('')
const descricao = ref('')
const categoria = ref('0')
const espacos = ref(1)
const ehArma = ref(false)
const dano = ref('')
const critico = ref('')
const alcance = ref('')
const tipoDano = ref('')

async function salvar() {
  await $fetch('/api/itens', {
    method: 'POST',
    body: {
      nome: nome.value,
      descricao: descricao.value,
      categoria: categoria.value,
      espacos: espacos.value,
      dano: ehArma.value ? dano.value : null,
      critico: ehArma.value ? critico.value : null,
      alcance: ehArma.value ? alcance.value : null,
      tipoDano: ehArma.value ? tipoDano.value : null,
    },
  })

  router.push('/catalogo/novo-item')
}
</script>

<template>
  <div>
    <h1>Novo Item Customizado</h1>

    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="nome" required />
      </div>

      <div>
        <label>Descrição</label>
        <textarea v-model="descricao"></textarea>
      </div>

      <div>
        <label>Categoria</label>
        <select v-model="categoria">
          <option value="0">0</option>
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
        </select>
      </div>

      <div>
        <label>Espaços</label>
        <input v-model.number="espacos" type="number" min="0" />
      </div>

      <div>
        <label><input v-model="ehArma" type="checkbox" /> É uma arma</label>
      </div>

      <template v-if="ehArma">
        <div>
          <label>Dano</label>
          <input v-model="dano" placeholder="ex: 2d6" />
        </div>
        <div>
          <label>Crítico</label>
          <input v-model="critico" placeholder="ex: 19/x3" />
        </div>
        <div>
          <label>Alcance</label>
          <input v-model="alcance" placeholder="ex: Curto" />
        </div>
        <div>
          <label>Tipo de Dano</label>
          <input v-model="tipoDano" placeholder="ex: C, P, I, B, Fogo" />
        </div>
      </template>

      <button type="submit">Criar Item</button>
    </form>
  </div>
</template>
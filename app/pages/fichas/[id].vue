<script setup lang="ts">
const route = useRoute()

const { data: personagem, pending, error, refresh } = await useFetch(`/api/personagens/${route.params.id}`)

const nomesClasse: Record<string, string> = {
  COMBATENTE: 'Combatente',
  ESPECIALISTA: 'Especialista',
  OCULTISTA: 'Ocultista',
}

async function atualizarTreino(personagemPericiaId: string, novoTreino: string) {
  await $fetch(`/api/personagens/${route.params.id}/pericias/${personagemPericiaId}`, {
    method: 'PUT',
    body: { treino: novoTreino },
  })
  refresh()
}

</script>

<template>
  <div>
    <div v-if="pending">Carregando...</div>
    <div v-else-if="error">Ficha não encontrada.</div>

    <div v-else-if="personagem">
      <NuxtLink to="/fichas">← Voltar</NuxtLink>

      <h1>{{ personagem.nome }}</h1>
      <p>{{ nomesClasse[personagem.classe] }} — {{ personagem.trilha || 'Sem trilha' }}</p>
      <p>NEX: {{ personagem.nex }}%</p>

      <h2>Atributos</h2>
      <ul>
        <li>Agilidade: {{ personagem.agilidade }}</li>
        <li>Força: {{ personagem.forca }}</li>
        <li>Intelecto: {{ personagem.intelecto }}</li>
        <li>Presença: {{ personagem.presenca }}</li>
        <li>Vigor: {{ personagem.vigor }}</li>
      </ul>

      <h2>Recursos</h2>
      <ul>
        <li>PV: {{ personagem.pvAtual }}</li>
        <li>PE: {{ personagem.peAtual }}</li>
        <li>Sanidade: {{ personagem.sanidadeAtual }}</li>
      </ul>

      <h2>Perícias</h2>
      <ul v-if="personagem.pericias?.length">
        <li v-for="pp in personagem.pericias" :key="pp.id">
          {{ pp.pericia.nome }}
          <select :value="pp.treino" @change="atualizarTreino(pp.id, ($event.target as HTMLSelectElement).value)">
            <option value="LEIGO">Leigo</option>
            <option value="TREINADO">Treinado</option>
            <option value="VETERANO">Veterano</option>
            <option value="EXPERT">Expert</option>
          </select>
        </li>
      </ul>
      <p v-else>Nenhuma perícia adicionada ainda.</p>

      <h2>Rituais</h2>
      <ul v-if="personagem.rituais?.length">
        <li v-for="pr in personagem.rituais" :key="pr.id">
          {{ pr.ritual.nome }} ({{ pr.ritual.elemento }}, {{ pr.ritual.circulo }}º círculo)
        </li>
      </ul>
      <p v-else>Nenhum ritual conhecido ainda.</p>

      <AdicionarRitual
        :personagem-id="personagem.id"
        @adicionado="refresh()"
      />

      <h2>Inventário</h2>
      <ul v-if="personagem.itens?.length">
        <li v-for="pi in personagem.itens" :key="pi.id">
          {{ pi.item.nome }} (x{{ pi.quantidade }})
        </li>
      </ul>
      <p v-else>Inventário vazio.</p>

      <AdicionarItem
        :personagem-id="personagem.id"
        @adicionado="refresh()"
      />
    </div>
  </div>
</template>

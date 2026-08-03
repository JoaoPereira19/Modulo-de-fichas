export const useCampanhasStore = defineStore('campanhas', () => {

        const lista = ref([])
        const carregando = ref(false)

        async function buscarCampanhas() {
            carregando.value = true
            lista.value = await $fetch('/api/campanhas')
            carregando.value = false
        }

        const totalCampanhas = computed(() => lista.value.length)

        return { lista, carregando, buscarCampanhas, totalCampanhas }
   }
)
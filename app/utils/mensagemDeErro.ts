// Tira do erro de um $fetch a mensagem que o servidor mandou (ver server/utils/erros.ts).
// Se não houver nenhuma (ex.: servidor fora do ar), usa o texto padrão.
//
// Arquivos em app/utils/ são importados automaticamente pelo Nuxt, como os composables:
// basta chamar mensagemDeErro(e, '...') em qualquer componente ou página.
export function mensagemDeErro(e: any, padrao: string): string {
  return e?.data?.message || e?.data?.statusMessage || padrao
}

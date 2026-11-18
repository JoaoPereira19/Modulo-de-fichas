# CLAUDE.md — Módulo de Fichas (Ordem Paranormal)

Contexto completo do projeto e ponto em que a última sessão parou. Leia tudo antes de sugerir qualquer mudança.

---

## 1. Visão geral

Sistema web de gerenciamento de fichas de RPG de **Ordem Paranormal** (2ª edição), feito por **João** como projeto pessoal de férias e para uso exclusivo dele e de cerca de 6 amigos que jogam juntos.

- Repositório no GitHub: `JoaoPereira19/Projeto-de-Ferias`. Na máquina atual a pasta local se chama `Modulo-de-fichas`.
- Referências de regras: livro base *Ordem Paranormal RPG* (PDF), sites RPGpedia e C.R.I.S.
- Recurso mais desejado pelo grupo, para o **final** do projeto: **quadro investigativo compartilhado por campanha**.

### Objetivo duplo: o projeto também é para aprender

João é **iniciante total em Vue/Nuxt** e quer entender o que está fazendo. Por isso:

- Explique o "porquê" de cada conceito novo, em português, de forma curta e com exemplos.
- Prefira passos pequenos e verificáveis. Quando uma mudança mexe em vários trechos de um arquivo, **entregue o arquivo completo** (isso já evitou bugs como duas funções `main()` coladas no `seed.ts`).
- Ele escreve o código manualmente para fixar o aprendizado. Usa o Google Antigravity e o Codex como assistentes no VS Code, mas tinha combinado de usá-los só depois de entender a base. **Avise proativamente quando o Codex fizer sentido** (tarefas repetitivas/mecânicas, como gerar boilerplate de CRUD).
- Antes de decisões de design que mudam o schema ou o escopo, **pergunte e confirme**. Ele costuma ter boas regras de domínio e corrige o rumo.
- Responda sempre em **português do Brasil**.

---

## 2. Stack e versões

| Item | Detalhe |
|---|---|
| Framework | **Nuxt 4** (`^4.4.8`), Vue 3.5, estrutura `app/` do Nuxt 4 |
| Estado | **Pinia** com `@pinia/nuxt`, no estilo **Setup Store** (ref/computed/funções) |
| Backend | **Nitro** do próprio Nuxt (`server/api/`), sem Express separado |
| ORM | **Prisma 6.19.x**, versão **travada** com `~6.19.3` no `package.json` |
| Banco | **MongoDB Atlas** (migrado do SQLite ao trocar de notebook) |
| Gerenciador | **pnpm** 10.x |
| TypeScript | `<script setup lang="ts">` quando há anotações de tipo |
| Validação | **zod 4** nos corpos das requisições (`server/utils/esquemas.ts`) |
| Testes | **Vitest 5** (`pnpm test`), testes em `tests/` |

### Armadilhas conhecidas (já custaram horas)

1. **Prisma 7 NÃO suporta MongoDB** (não existe driver adapter oficial). Nunca atualize `prisma` / `@prisma/client` para 7.x. No Prisma 6 a URL do banco fica no `schema.prisma` (`url = env("DATABASE_URL")`) e o `PrismaClient` é criado **sem adapter**.
2. **pnpm 10 bloqueia scripts de build** de pacotes nativos silenciosamente. Se algo "instala sem erro mas não funciona" (ex.: `ERR_PNPM_IGNORED_BUILDS`), rode `pnpm approve-builds` e aprove tudo (tecla `a`, depois Enter).
3. **Node**: use versão **LTS** (22.x). Versões "current" (25) quebraram módulos nativos no passado. Com Mongo não há mais `better-sqlite3`, mas a recomendação continua valendo.
4. **Connection string do Atlas** precisa incluir o **nome do banco** (`...mongodb.net/NOME_DO_BANCO?retryWrites=true&w=majority`) e a senha deve ser alfanumérica ou ter caracteres especiais em URL-encode. O IP da máquina precisa estar liberado em *Network Access*.
5. **MongoDB não usa `prisma migrate dev`.** Use `npx prisma generate` + `npx prisma db push`.
6. **Nuxt 4**: `pages/`, `components/`, `stores/`, `layouts/`, `middleware/` ficam **dentro de `app/`**. `server/` e `prisma/` ficam na raiz.
7. **Rotas novas só aparecem após reiniciar** o `pnpm run dev`. Se algo estranho persistir: parar o servidor, `rm -rf .nuxt`, subir de novo.
8. **Não misture `pages/fichas/[id].vue` com a pasta `pages/fichas/[id]/`.** Padrão adotado: `pages/fichas/[id]/index.vue` e `pages/fichas/[id]/editar.vue`.
9. **Componentes em subpastas**: o `nuxt.config.ts` desliga o prefixo por pasta (`pathPrefix: false`), então `app/components/ficha/AdicionarPericia.vue` é usado como `<AdicionarPericia />`.
10. Erros vermelhos do editor após mudar o schema (ex.: "a propriedade X não existe no tipo...") normalmente se resolvem com `npx prisma generate`, reiniciar o servidor e `TypeScript: Restart TS Server`. Também confira se há arquivos **não salvos** (bolinha na aba).
11. O erro "process não encontrado" em `prisma.config.ts` é **cosmético** (pode-se adicionar `// @ts-nocheck`).
12. Após adicionar algo numa ficha, a tela usa `refresh()` do `useFetch` (e não `array.push`) para recarregar os dados.

### Arquivos de configuração (estado atual)

- `nuxt.config.ts`: `modules: ['@pinia/nuxt']`, `components: [{ path: '~/components', pathPrefix: false }]`.
- `prisma.config.ts` (mínimo, Prisma 6): apenas `migrations: { seed: 'npx tsx prisma/seed.ts' }`, com `import 'dotenv/config'`.
- `server/utils/prisma.ts`: `import { PrismaClient } from '@prisma/client'; export const prisma = new PrismaClient()`.
- `.env`: `DATABASE_URL` do Atlas. **Nunca commitar o `.env`** (contém usuário e senha do cluster). Confirmar com `git status` antes de qualquer `git add .`.

---

## 3. Estrutura de pastas atual

```
app/
├── app.vue                     # só <NuxtPage />
├── components/ficha/
│   ├── FormularioFicha.vue     # formulário único de Nova/Editar Ficha, com prévia ao vivo
│   ├── AdicionarPericia.vue
│   ├── AdicionarRitual.vue
│   └── AdicionarItem.vue
├── utils/
│   └── mensagemDeErro.ts       # lê a mensagem de erro do servidor (auto-importado)
├── pages/
│   ├── index.vue
│   ├── campanha/[id].vue, campanhas/index.vue   # exercícios antigos com dados fixos
│   ├── fichas/
│   │   ├── index.vue           # listagem
│   │   ├── nova.vue            # criar ficha
│   │   └── [id]/index.vue, editar.vue
│   └── catalogo/               # sem links na interface ainda
│       ├── nova-pericia.vue, novo-ritual.vue, novo-item.vue
└── stores/
    ├── campanhas.ts            # exercício antigo
    └── personagens.ts

server/
├── api/
│   ├── personagens/
│   │   ├── index.get.ts, index.post.ts
│   │   └── [id]/
│   │       ├── index.get.ts, index.put.ts, index.delete.ts
│   │       ├── pericias.post.ts, rituais.post.ts, itens.post.ts
│   │       ├── pericias/[personagemPericiaId].put.ts   # muda o treino
│   │       └── itens/[personagemItemId].delete.ts      # remover item
│   ├── pericias.get.ts / pericias.post.ts
│   ├── rituais.get.ts  / rituais.post.ts
│   ├── itens.get.ts    / itens.post.ts
│   ├── origens.get.ts
│   └── campanhas.get.ts        # exercício antigo
└── utils/
    ├── prisma.ts               # instância única do PrismaClient
    ├── usuarioAtual.ts         # obterUsuarioAtualId(): usuário do seed até existir login (Fase 3)
    ├── validacao.ts            # lerBodyValidado() e lerIdDaRota()
    ├── esquemas.ts             # esquemas zod de cada requisição
    └── erros.ts                # definirRota() e erroHttp(): traduz erros do Prisma

shared/
└── utils/
    └── calcularRecursos.ts     # fórmulas de PV/PE/SAN, carga, defesa, deslocamento (servidor + telas)

tests/
└── calcularRecursos.test.ts    # testes das regras do jogo (Vitest)

prisma/
├── schema.prisma
└── seed.ts
```

Os imports dentro de `server/api/` usam **caminhos relativos** (ex.: `'../../../utils/prisma'`), porque o alias `~/` não funcionou bem em `server/`. A exceção é `shared/`, importado com `#shared/utils/...` tanto no servidor quanto nas telas.

### Padrões das rotas (seguir em toda rota nova)

- Usar `definirRota(async (event) => { ... }, { P2002: 'mensagem', P2025: 'mensagem' })` no lugar de `defineEventHandler`. Erros do Prisma viram 409/404 com mensagem em português; não escrever `try/catch` para isso.
- Ler o corpo com `lerBodyValidado(event, esquema)` e os parâmetros da URL com `lerIdDaRota(event, 'id')`. Os esquemas usam `z.strictObject`, então **campo com nome errado dá 400** (foi assim que o bug `origem` × `origemId` passou despercebido antes).
- Criar erros com `erroHttp(status, mensagem)` (usa `message`, não `statusMessage`).
- Ao criar uma ligação (ficha ↔ catálogo), usar `connect` (`personagem: { connect: { id } }`), não o id direto: no Mongo o Prisma não confere se o registro existe e gravaria uma ligação órfã.
- Excluir algo com "filhos" exige apagar os filhos antes, numa `$transaction` (ver `[id]/index.delete.ts`).
- Nas telas, mostrar erros com `mensagemDeErro(e, 'texto padrão')`.

---

## 4. Modelo de dados (Prisma + MongoDB)

Todos os `id` são `String @id @default(auto()) @map("_id") @db.ObjectId`; toda chave estrangeira leva `@db.ObjectId`.

- **Usuario**: nome, email (único), senhaHash. Relações: personagens, rituais/perícias/itens criados, campanhas como mestre.
- **Personagem**: nome, `classe` (enum COMBATENTE/ESPECIALISTA/OCULTISTA), `origem` (relação com `Origem`), trilha (texto livre), `nex` (editável, padrão 5), atributos (agilidade, forca, intelecto, presenca, vigor, padrão 1), `pvAtual`, `peAtual`, `sanidadeAtual`, usuario, campanha (opcional). Relações: pericias, itens, rituais, habilidades.
- **Pericia**: nome (único), atributoBase, soTreinada, carga, kit, `origem` OFICIAL/CUSTOMIZADO, criadoPor, campanha (opcional). Tabela de junção **PersonagemPericia** (treino: LEIGO/TREINADO/VETERANO/EXPERT; `@@unique([personagemId, periciaId])`).
- **Ritual**: nome (**não único**, pois "Amaldiçoar Arma" existe em 4 elementos), circulo, elemento, custoPE, descricao, origem OFICIAL/CUSTOMIZADO, livro, criadoPor, campanha. Junção **PersonagemRitual**.
- **Item**: nome, descricao, categoria (0/I/II/III/IV), espacos, e campos de arma opcionais (dano, critico, alcance, tipoDano), origem OFICIAL/CUSTOMIZADO, livro, criadoPor, campanha. Junção **PersonagemItem** (quantidade; `@@unique([personagemId, itemId])`).
- **Origem**: nome (único), poderNome, poderDescricao.
- **Habilidade**: nome, descricao, tipo (ORIGEM/TRILHA/CLASSE/PODER_PARANORMAL), vinculada a Personagem. **Existe no schema, mas ainda não tem rotas nem tela.**
- **Campanha**: nome, descricao, mestre (relação com Usuario), personagens, periciasCustomizadas, rituaisCustomizados, itensCustomizados. **Ainda sem rotas nem tela.**

### Seed (`prisma/seed.ts`, `npx prisma db seed`)

Popula: usuário de teste (`joao@teste.com`), **28 perícias**, **26 origens**, **85 rituais** (1º ao 4º círculo, livro base), **77 itens** (armas, munições, proteções, equipamento geral, itens paranormais).

- Perícias e origens usam `upsert` (seguro rodar de novo). **Rituais e itens usam `create`: rodar o seed duas vezes duplica.** Para recomeçar, limpe as coleções antes.
- Os textos de `descricao` dos rituais são resumos curtos de uma linha. As `poderDescricao` das origens são **placeholders genéricos**, não o texto oficial. Não colar texto longo do livro no projeto.
- **Não foram importados**: Sobrevivendo ao Horror (o PDF disponível trazia marca d'água de outro comprador; só prosseguir com uma cópia legítima do próprio João) e itens amaldiçoados (são um sistema procedural de maldições, pendente para depois).

---

## 5. Regras de Ordem Paranormal já implementadas

Calculadas **em tempo real** em `shared/utils/calcularRecursos.ts`: o servidor devolve os valores em `GET /api/personagens/[id]` (não ficam gravados no banco) e o `FormularioFicha.vue` usa as mesmas funções para a prévia ao vivo. Cobertas por testes em `tests/calcularRecursos.test.ts`; rode `pnpm test` depois de mexer em qualquer fórmula.

Níveis ganhos = `max(0, floor((NEX - 5) / 5))`, **exceto NEX 99, que vale 19 níveis** (o NEX sobe de 5 em 5 até 95% e depois vai para 99%, um patamar próprio). Função `calcularNiveisGanhos`.

| Classe | PV | PE | Sanidade |
|---|---|---|---|
| Combatente | 20+Vig, +4+Vig por NEX | 2+Pre, +2+Pre por NEX | 12, +3 por NEX |
| Especialista | 16+Vig, +3+Vig por NEX | 3+Pre, +3+Pre por NEX | 16, +4 por NEX |
| Ocultista | 12+Vig, +2+Vig por NEX | 4+Pre, +4+Pre por NEX | 20, +5 por NEX |

- **Carga**: limite = `5 × Força` (2 se Força 0); sobrecarregado acima do limite, excedido acima do dobro. Soma `espacos × quantidade` dos itens.
- **Defesa** = `10 + Agilidade` (ainda sem bônus de proteção/escudo equipados).
- **Deslocamento** = 9 m, menos 3 m se sobrecarregado.
- Categorias de item vs. patente, e custo de PE dos rituais por círculo (1/3/6/10), seguem o livro.

---

## 6. Decisões de produto já tomadas

- **NEX é um campo editável**, não derivado de fórmula. PV/PE/Sanidade máximos são derivados de NEX + classe e **não são armazenados**.
- Ao **criar a ficha**: as 28 perícias oficiais entram automaticamente como LEIGO (jogador só altera o treino) e PV/PE/Sanidade atuais começam iguais aos máximos.
- **Não haverá "remover perícia" da ficha**: a distribuição de perícias é responsabilidade do mestre.
- **Origem** é um catálogo fixo (select), e cada origem traz seu poder.
- **Rituais, perícias e itens**: catálogo oficial pré-cadastrado + possibilidade de criar **customizados**, que devem pertencer a uma **campanha** (o mestre decide o que existe) e aparecer automaticamente nas fichas dos personagens daquela campanha.
- Customizados ficam, por ora, "soltos" (sem campanha). As telas `/catalogo/*` existem mas estão sem links, e a decisão final foi **pausar isso até a Fase 3**.
- Habilidades (de origem, trilha, classe, poderes paranormais) terão uma área própria na ficha, com cadastro livre de nome/descrição/tipo (sem catálogo fixo, por enquanto).
- Fidelidade ao livro é prioridade, mas sem copiar trechos longos protegidos por direitos autorais.

---

## 7. O que funciona (testado com o MongoDB, novembro/2026)

- Listar, criar, ver, editar (incluindo origem e NEX) e excluir ficha. A exclusão apaga junto perícias, rituais, itens e habilidades da ficha.
- Formulário de ficha com prévia ao vivo de PV/PE/SAN máximos, Defesa e limite de carga.
- Alterar o treino de cada perícia; adicionar rituais e itens; remover item.
- Validação de todos os dados recebidos (400 com explicação) e erros do Prisma traduzidos (409 duplicata, 404 inexistente), exibidos nas telas.
- Cálculos de PV/PE/Sanidade máximos, carga, defesa e deslocamento, com testes automáticos.

---

## 8. Onde parou

A sessão de novembro/2026 corrigiu os bugs pós-migração e reforçou a base:

- `usuarioId` fixo substituído por `obterUsuarioAtualId()` (usuário do seed).
- Edição de ficha salvando origem e NEX; exclusão de ficha funcionando.
- zod em todas as rotas, `definirRota` para erros do Prisma, `connect` contra ligações órfãs.
- `FormularioFicha.vue` único, regras em `shared/`, Vitest com testes das fórmulas (corrigiu o NEX 99).
- Git configurado na máquina nova (`JoaoPereira19`); commits enviados ao GitHub.

### Pendências imediatas (em ordem de prioridade)

1. **Banco de desenvolvimento separado**: criar um segundo banco no mesmo cluster (ex.: `fichas_dev`), apontar a `DATABASE_URL` local para ele e rodar `db push` + `db seed`, para que testes não mexam nas fichas reais do grupo.
2. **Implementar Habilidades**: rota `POST /api/personagens/[id]/habilidades`, formulário (nome, descrição, tipo) e listagem na ficha; opcionalmente já incluir o poder da Origem escolhida. Seguir os padrões de rota da seção 3.
3. **Seed idempotente** (pede confirmação, mexe no schema): rituais e itens com `upsert` e `@@unique` (nome + elemento / nome + categoria), para o seed não duplicar.
4. **Cascata no schema** (opcional, pede confirmação): `onDelete: Cascade` nas junções, no lugar da transação manual do `DELETE`.
5. **Limpeza** (boa tarefa para o Codex): `dev.db` e `prisma/migrations/` (restos do SQLite), skills triplicadas em `.agents/`, `.claude/` e `.windsurf/`, exercícios de campanhas com dados fixos; instalar `typescript` + `vue-tsc` para o `nuxi typecheck`; trocar os `any` da store por tipos.
6. Brecha conhecida: mudar treino e remover item não conferem se aquele registro pertence à ficha da URL. Fechar junto com a autenticação (Fase 3).

### Próximas fases planejadas

- **Fase 3 – Modo Mestre**: autenticação (jogador x mestre), campanhas, NPCs, vincular ficha à campanha, perícias/rituais/itens customizados por campanha (propagando para as fichas), mecanismo de "sincronizar perícias" para fichas já existentes, middleware `auth.global.ts`, layout padrão com navegação (`app/layouts/default.vue`) e links para o catálogo customizado.
- **Fase 4 – Rolagens compartilhadas em tempo real** (WebSocket/SSE via Nitro).
- **Fase 5 – Quadro investigativo compartilhado por campanha.**
- Pendências de conteúdo: suplemento *Sobrevivendo ao Horror* (com cópia própria do João), itens amaldiçoados, catálogos de trilhas e poderes paranormais, bônus de proteção/escudo na Defesa.

---

## 9. Comandos úteis

```bash
pnpm install                 # instalar dependências
pnpm approve-builds          # se algum build nativo ficar bloqueado
npx prisma generate          # regenerar o client após mudar o schema
npx prisma db push           # sincronizar o schema com o MongoDB
npx prisma db seed           # popular o catálogo (cuidado: duplica rituais/itens)
npx prisma studio            # ver os dados no navegador
pnpm run dev                 # servidor de desenvolvimento (localhost:3000)
pnpm test                    # roda os testes uma vez
pnpm test:watch              # roda os testes a cada arquivo salvo
git status                   # sempre conferir antes de commitar (nada de .env)
```

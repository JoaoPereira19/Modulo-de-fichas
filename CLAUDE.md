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
│   ├── AdicionarPericia.vue
│   ├── AdicionarRitual.vue
│   └── AdicionarItem.vue
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
    └── calcularRecursos.ts     # fórmulas de PV/PE/SAN, carga, defesa, deslocamento

prisma/
├── schema.prisma
└── seed.ts
```

Os imports dentro de `server/api/` usam **caminhos relativos** (ex.: `'../../../utils/prisma'`), porque o alias `~/` não funcionou bem em `server/`.

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

Calculadas **em tempo real** em `server/utils/calcularRecursos.ts` e devolvidas em `GET /api/personagens/[id]` (não ficam gravadas no banco).

Níveis ganhos = `max(0, floor((NEX - 5) / 5))`.

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

## 7. O que funciona (validado antes da troca para Mongo)

- Listar, criar, ver e editar ficha (nome, classe, origem, trilha, atributos, recursos).
- Alterar o treino de cada perícia na ficha.
- Adicionar rituais e itens à ficha, com mensagem amigável para duplicata (erro `P2002` → HTTP 409).
- Cálculos de PV/PE/Sanidade máximos, carga, defesa e deslocamento.

---

## 8. Onde parou

A **última sessão foi a migração do SQLite para MongoDB Atlas numa máquina nova**. Chegou-se a:

- Prisma travado na 6.19.x, `schema.prisma` convertido para MongoDB, `prisma db push` e `prisma db seed` rodando com sucesso (28 perícias, 26 origens, 85 rituais, 77 itens).
- Tentativa de commit no VS Code falhou por falta de `user.name`/`user.email` do Git na máquina nova (resolver com `git config --global`). **O commit dessa migração ainda precisa ser feito/confirmado.**

### Pendências imediatas (em ordem de prioridade)

1. **Trocar o `usuarioId` fixo `'usuario-teste-01'`**. Ele ainda aparece em `app/stores/personagens.ts` (`criarPersonagem`) e em `server/api/pericias.post.ts`, `rituais.post.ts` e `itens.post.ts` (`criadoPorId`). No MongoDB isso **não é um ObjectId válido e vai quebrar a criação de ficha**. Solução temporária sugerida: no servidor, usar `prisma.usuario.findFirstOrThrow()` (usuário do seed) até existir login na Fase 3.
2. **Testar tudo na tela com o Mongo** (`pnpm run dev`): `/fichas`, criar ficha de cada classe, conferir os valores de PV/PE/Sanidade (ex.: Combatente NEX 5 com Vigor 1 → PV 21; NEX 10 → 26), adicionar ritual/item, alterar treino, editar ficha.
3. **Confirmar os 4 ajustes que estavam sendo aplicados quando a troca de máquina aconteceu** (o código foi passado, mas não houve confirmação de que está tudo aplicado e funcionando):
   - Remover item do inventário (`DELETE /api/personagens/[id]/itens/[personagemItemId]` + botão "Remover" na ficha).
   - PV/PE/Sanidade atuais iguais aos máximos na criação (`index.post.ts` usando `calcularRecursosMaximos`).
   - **Origem como catálogo**: `GET /api/origens`, `origemId` em `index.post.ts` e `[id]/index.put.ts`, `<select>` em `nova.vue` e `editar.vue`, `include: { origem: true }` no `GET` da ficha e exibição com `personagem.origem?.nome`.
   - Exibir carga, defesa e deslocamento na tela (`index.vue` da ficha).
4. **Implementar Habilidades**: rota `POST /api/personagens/[id]/habilidades`, formulário (nome, descrição, tipo) e listagem na ficha; opcionalmente já incluir o poder da Origem escolhida.
5. Conferir que `.env` está no `.gitignore` e **não** entra no commit.

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
git status                   # sempre conferir antes de commitar (nada de .env)
```

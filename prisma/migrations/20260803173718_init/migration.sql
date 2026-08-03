-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Personagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "trilha" TEXT,
    "nex" INTEGER NOT NULL DEFAULT 5,
    "agilidade" INTEGER NOT NULL DEFAULT 1,
    "forca" INTEGER NOT NULL DEFAULT 1,
    "intelecto" INTEGER NOT NULL DEFAULT 1,
    "presenca" INTEGER NOT NULL DEFAULT 1,
    "vigor" INTEGER NOT NULL DEFAULT 1,
    "pvAtual" INTEGER NOT NULL DEFAULT 0,
    "peAtual" INTEGER NOT NULL DEFAULT 0,
    "sanidadeAtual" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "campanhaId" TEXT,
    CONSTRAINT "Personagem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Personagem_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pericia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "atributoBase" TEXT NOT NULL,
    "origem" TEXT NOT NULL DEFAULT 'OFICIAL',
    "criadoPorId" TEXT,
    "campanhaId" TEXT,
    CONSTRAINT "Pericia_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pericia_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonagemPericia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "treino" TEXT NOT NULL DEFAULT 'LEIGO',
    "personagemId" TEXT NOT NULL,
    "periciaId" TEXT NOT NULL,
    CONSTRAINT "PersonagemPericia_personagemId_fkey" FOREIGN KEY ("personagemId") REFERENCES "Personagem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonagemPericia_periciaId_fkey" FOREIGN KEY ("periciaId") REFERENCES "Pericia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ritual" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "circulo" INTEGER NOT NULL,
    "elemento" TEXT NOT NULL,
    "custoPE" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL DEFAULT 'OFICIAL',
    "livro" TEXT,
    "criadoPorId" TEXT,
    "campanhaId" TEXT,
    CONSTRAINT "Ritual_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ritual_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonagemRitual" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personagemId" TEXT NOT NULL,
    "ritualId" TEXT NOT NULL,
    CONSTRAINT "PersonagemRitual_personagemId_fkey" FOREIGN KEY ("personagemId") REFERENCES "Personagem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonagemRitual_ritualId_fkey" FOREIGN KEY ("ritualId") REFERENCES "Ritual" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "origem" TEXT NOT NULL DEFAULT 'OFICIAL',
    "livro" TEXT,
    "criadoPorId" TEXT,
    "campanhaId" TEXT,
    CONSTRAINT "Item_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonagemItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "personagemId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "PersonagemItem_personagemId_fkey" FOREIGN KEY ("personagemId") REFERENCES "Personagem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonagemItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mestreId" TEXT NOT NULL,
    CONSTRAINT "Campanha_mestreId_fkey" FOREIGN KEY ("mestreId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonagemPericia_personagemId_periciaId_key" ON "PersonagemPericia"("personagemId", "periciaId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonagemRitual_personagemId_ritualId_key" ON "PersonagemRitual"("personagemId", "ritualId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonagemItem_personagemId_itemId_key" ON "PersonagemItem"("personagemId", "itemId");

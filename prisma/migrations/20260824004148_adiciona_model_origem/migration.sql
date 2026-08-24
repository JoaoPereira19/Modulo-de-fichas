/*
  Warnings:

  - You are about to drop the column `origem` on the `Personagem` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Origem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "poderNome" TEXT NOT NULL,
    "poderDescricao" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personagem" (
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
    "origemId" TEXT,
    CONSTRAINT "Personagem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Personagem_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Personagem_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "Origem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Personagem" ("agilidade", "campanhaId", "classe", "criadoEm", "forca", "id", "intelecto", "nex", "nome", "peAtual", "presenca", "pvAtual", "sanidadeAtual", "trilha", "usuarioId", "vigor") SELECT "agilidade", "campanhaId", "classe", "criadoEm", "forca", "id", "intelecto", "nex", "nome", "peAtual", "presenca", "pvAtual", "sanidadeAtual", "trilha", "usuarioId", "vigor" FROM "Personagem";
DROP TABLE "Personagem";
ALTER TABLE "new_Personagem" RENAME TO "Personagem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Origem_nome_key" ON "Origem"("nome");

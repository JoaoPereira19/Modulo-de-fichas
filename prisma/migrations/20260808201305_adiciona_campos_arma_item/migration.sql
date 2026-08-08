-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "espacos" INTEGER NOT NULL DEFAULT 1,
    "dano" TEXT,
    "critico" TEXT,
    "alcance" TEXT,
    "tipoDano" TEXT,
    "origem" TEXT NOT NULL DEFAULT 'OFICIAL',
    "livro" TEXT,
    "criadoPorId" TEXT,
    "campanhaId" TEXT,
    CONSTRAINT "Item_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("campanhaId", "criadoPorId", "descricao", "id", "livro", "nome", "origem") SELECT "campanhaId", "criadoPorId", "descricao", "id", "livro", "nome", "origem" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pericia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "atributoBase" TEXT NOT NULL,
    "soTreinada" BOOLEAN NOT NULL DEFAULT false,
    "carga" BOOLEAN NOT NULL DEFAULT false,
    "kit" BOOLEAN NOT NULL DEFAULT false,
    "origem" TEXT NOT NULL DEFAULT 'OFICIAL',
    "criadoPorId" TEXT,
    "campanhaId" TEXT,
    CONSTRAINT "Pericia_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pericia_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pericia" ("atributoBase", "campanhaId", "criadoPorId", "id", "nome", "origem") SELECT "atributoBase", "campanhaId", "criadoPorId", "id", "nome", "origem" FROM "Pericia";
DROP TABLE "Pericia";
ALTER TABLE "new_Pericia" RENAME TO "Pericia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

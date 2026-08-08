/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Pericia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pericia_nome_key" ON "Pericia"("nome");

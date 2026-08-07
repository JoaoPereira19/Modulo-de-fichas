import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pericias = [
  { nome: 'Acrobacia', atributoBase: 'Agilidade', soTreinada: false, carga: true, kit: false },
  { nome: 'Adestramento', atributoBase: 'Presença', soTreinada: true, carga: false, kit: false },
  { nome: 'Artes', atributoBase: 'Presença', soTreinada: true, carga: false, kit: false },
  { nome: 'Atletismo', atributoBase: 'Força', soTreinada: false, carga: false, kit: false },
  { nome: 'Atualidades', atributoBase: 'Intelecto', soTreinada: false, carga: false, kit: false },
  { nome: 'Ciências', atributoBase: 'Intelecto', soTreinada: true, carga: false, kit: false },
  { nome: 'Crime', atributoBase: 'Agilidade', soTreinada: true, carga: true, kit: true },
  { nome: 'Diplomacia', atributoBase: 'Presença', soTreinada: false, carga: false, kit: false },
  { nome: 'Enganação', atributoBase: 'Presença', soTreinada: false, carga: false, kit: true },
  { nome: 'Fortitude', atributoBase: 'Vigor', soTreinada: false, carga: false, kit: false },
  { nome: 'Furtividade', atributoBase: 'Agilidade', soTreinada: false, carga: true, kit: false },
  { nome: 'Iniciativa', atributoBase: 'Agilidade', soTreinada: false, carga: false, kit: false },
  { nome: 'Intimidação', atributoBase: 'Presença', soTreinada: false, carga: false, kit: false },
  { nome: 'Intuição', atributoBase: 'Intelecto', soTreinada: false, carga: false, kit: false },
  { nome: 'Investigação', atributoBase: 'Intelecto', soTreinada: false, carga: false, kit: false },
  { nome: 'Luta', atributoBase: 'Força', soTreinada: false, carga: false, kit: false },
  { nome: 'Medicina', atributoBase: 'Intelecto', soTreinada: false, carga: false, kit: true },
  { nome: 'Ocultismo', atributoBase: 'Intelecto', soTreinada: true, carga: false, kit: false },
  { nome: 'Percepção', atributoBase: 'Presença', soTreinada: false, carga: false, kit: false },
  { nome: 'Pilotagem', atributoBase: 'Agilidade', soTreinada: true, carga: false, kit: false },
  { nome: 'Pontaria', atributoBase: 'Agilidade', soTreinada: false, carga: false, kit: false },
  { nome: 'Profissão', atributoBase: 'Intelecto', soTreinada: true, carga: false, kit: false },
  { nome: 'Reflexos', atributoBase: 'Agilidade', soTreinada: false, carga: false, kit: false },
  { nome: 'Religião', atributoBase: 'Presença', soTreinada: true, carga: false, kit: false },
  { nome: 'Sobrevivência', atributoBase: 'Intelecto', soTreinada: false, carga: false, kit: false },
  { nome: 'Tática', atributoBase: 'Intelecto', soTreinada: true, carga: false, kit: false },
  { nome: 'Tecnologia', atributoBase: 'Intelecto', soTreinada: true, carga: false, kit: true },
  { nome: 'Vontade', atributoBase: 'Presença', soTreinada: false, carga: false, kit: false },
]

async function main() {
  for (const pericia of pericias) {
    await prisma.pericia.upsert({
      where: { nome: pericia.nome },
      update: {},
      create: { ...pericia, origem: 'OFICIAL' }
    })
  }
  console.log(`${pericias.length} perícias cadastradas.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
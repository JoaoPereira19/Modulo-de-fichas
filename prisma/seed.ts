import PrismaClientPkg from '@prisma/client'
const { PrismaClient } = PrismaClientPkg

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

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

const CUSTO_POR_CIRCULO = { 1: 1, 2: 3, 3: 6, 4: 10 }

const rituais = [
  // 1º CÍRCULO — CONHECIMENTO
  { nome: 'Amaldiçoar Arma', circulo: 1, elemento: 'Conhecimento', descricao: 'Arma causa mais dano.' },
  { nome: 'Compreensão Paranormal', circulo: 1, elemento: 'Conhecimento', descricao: 'Você entende qualquer linguagem escrita ou falada.' },
  { nome: 'Enfeitiçar', circulo: 1, elemento: 'Conhecimento', descricao: 'Alvo se torna prestativo.' },
  { nome: 'Perturbação', circulo: 1, elemento: 'Conhecimento', descricao: 'Força o alvo a obedecer a uma ordem.' },
  { nome: 'Ouvir os Sussurros', circulo: 1, elemento: 'Conhecimento', descricao: 'Você se comunica com vozes do Outro Lado para receber informações.' },
  { nome: 'Tecer Ilusão', circulo: 1, elemento: 'Conhecimento', descricao: 'Cria uma ilusão visual ou sonora.' },
  { nome: 'Terceiro Olho', circulo: 1, elemento: 'Conhecimento', descricao: 'Você vê manifestações paranormais.' },

  // 1º CÍRCULO — ENERGIA
  { nome: 'Amaldiçoar Arma', circulo: 1, elemento: 'Energia', descricao: 'Arma causa mais dano.' },
  { nome: 'Amaldiçoar Tecnologia', circulo: 1, elemento: 'Energia', descricao: 'Aprimora um item.' },
  { nome: 'Coincidência Forçada', circulo: 1, elemento: 'Energia', descricao: 'Recebe bônus em um teste.' },
  { nome: 'Eletrocussão', circulo: 1, elemento: 'Energia', descricao: 'Corrente voltaica eletrocuta o alvo.' },
  { nome: 'Embaralhar', circulo: 1, elemento: 'Energia', descricao: 'Cria duplicatas para confundir os inimigos, oferecendo bônus na Defesa.' },
  { nome: 'Luz', circulo: 1, elemento: 'Energia', descricao: 'Objeto brilha como uma lâmpada.' },
  { nome: 'Polarização Caótica', circulo: 1, elemento: 'Energia', descricao: 'Objetos metálicos são atraídos ou repelidos conforme sua vontade.' },

  // 1º CÍRCULO — MORTE
  { nome: 'Amaldiçoar Arma', circulo: 1, elemento: 'Morte', descricao: 'Arma causa mais dano.' },
  { nome: 'Cicatrização', circulo: 1, elemento: 'Morte', descricao: 'Acelera a regeneração de um ferimento.' },
  { nome: 'Consumir Manancial', circulo: 1, elemento: 'Morte', descricao: 'Suga o tempo de vida de seres próximos, recebendo PV temporários.' },
  { nome: 'Decadência', circulo: 1, elemento: 'Morte', descricao: 'Acelera o envelhecimento dos órgãos internos do alvo, fazendo seu corpo definhar.' },
  { nome: 'Definhar', circulo: 1, elemento: 'Morte', descricao: 'Alvo fica fatigado ou vulnerável.' },
  { nome: 'Espirais da Perdição', circulo: 1, elemento: 'Morte', descricao: 'Inimigos sofrem penalidade em ataque e dano.' },
  { nome: 'Nuvem de Cinzas', circulo: 1, elemento: 'Morte', descricao: 'Nuvem fornece camuflagem.' },

  // 1º CÍRCULO — SANGUE
  { nome: 'Amaldiçoar Arma', circulo: 1, elemento: 'Sangue', descricao: 'Arma causa mais dano.' },
  { nome: 'Arma Atroz', circulo: 1, elemento: 'Sangue', descricao: 'Arma corpo a corpo causa dano adicional de Sangue.' },
  { nome: 'Armadura de Sangue', circulo: 1, elemento: 'Sangue', descricao: 'Recobre o corpo com placas de sangue endurecido.' },
  { nome: 'Corpo Adaptado', circulo: 1, elemento: 'Sangue', descricao: 'Ignora frio e calor, pode respirar debaixo d\'água.' },
  { nome: 'Distorcer Aparência', circulo: 1, elemento: 'Sangue', descricao: 'Muda a aparência de um ou mais alvos.' },
  { nome: 'Fortalecimento Sensorial', circulo: 1, elemento: 'Sangue', descricao: 'Melhora seus sentidos e sua percepção.' },
  { nome: 'Ódio Incontrolável', circulo: 1, elemento: 'Sangue', descricao: 'Aumenta dano corpo a corpo e perícias físicas, mas piora perícias mentais.' },

  // 1º CÍRCULO — MEDO
  { nome: 'Cinerária', circulo: 1, elemento: 'Medo', descricao: 'Névoa fortalece rituais na área.' },

  // 2º CÍRCULO — CONHECIMENTO
  { nome: 'Aprimorar Mente', circulo: 2, elemento: 'Conhecimento', descricao: 'Fornece bônus em Intelecto ou Presença.' },
  { nome: 'Detecção de Ameaças', circulo: 2, elemento: 'Conhecimento', descricao: 'Detecta personagens hostis e armadilhas na área.' },
  { nome: 'Esconder dos Olhos', circulo: 2, elemento: 'Conhecimento', descricao: 'Torna o usuário invisível aos olhos comuns por determinado tempo.' },
  { nome: 'Invadir Mente', circulo: 2, elemento: 'Conhecimento', descricao: 'Gera uma rajada mental ou se conecta telepaticamente.' },
  { nome: 'Localização', circulo: 2, elemento: 'Conhecimento', descricao: 'Determina em que direção está um objeto ou ser a sua escolha.' },

  // 2º CÍRCULO — ENERGIA
  { nome: 'Chamas do Caos', circulo: 2, elemento: 'Energia', descricao: 'Controla o fogo.' },
  { nome: 'Contenção Fantasmagórica', circulo: 2, elemento: 'Energia', descricao: 'Laços de energia prendem o alvo.' },
  { nome: 'Dissonância Acústica', circulo: 2, elemento: 'Energia', descricao: 'Cria uma área em que é impossível ouvir sons.' },
  { nome: 'Sopro do Caos', circulo: 2, elemento: 'Energia', descricao: 'Move o ar de formas impossíveis.' },
  { nome: 'Tela de Ruído', circulo: 2, elemento: 'Energia', descricao: 'Cria uma película protetora que absorve dano.' },

  // 2º CÍRCULO — MORTE
  { nome: 'Desacelerar Impacto', circulo: 2, elemento: 'Morte', descricao: 'Recebendo resistência contra ataques físicos e balísticos.' },
  { nome: 'Eco Espiral', circulo: 2, elemento: 'Morte', descricao: 'Repete o dano que o alvo sofreu ao longo das rodadas concentrando.' },
  { nome: 'Paradoxo', circulo: 2, elemento: 'Morte', descricao: 'Cria uma área de tempo paradoxal, capaz de envelhecer corpo e alma.' },
  { nome: 'Miasma Entrópico', circulo: 2, elemento: 'Morte', descricao: 'Nuvem tóxica enjoa e sufoca os alvos.' },
  { nome: 'Velocidade Mortal', circulo: 2, elemento: 'Morte', descricao: 'Alvo acelera no tempo, realizando ações adicionais.' },

  // 2º CÍRCULO — SANGUE
  { nome: 'Aprimorar Físico', circulo: 2, elemento: 'Sangue', descricao: 'Fornece bônus em Agilidade ou Força.' },
  { nome: 'Descarnar', circulo: 2, elemento: 'Sangue', descricao: 'A pele do alvo é dilacerada, abrindo cortes profundos.' },
  { nome: 'Flagelo de Sangue', circulo: 2, elemento: 'Sangue', descricao: 'Alvo precisa obedecer uma ordem.' },
  { nome: 'Hemofagia', circulo: 2, elemento: 'Sangue', descricao: 'Absorve o sangue do alvo, causando dano e recuperando seus pontos de vida.' },
  { nome: 'Transfusão Vital', circulo: 2, elemento: 'Sangue', descricao: 'Transferir vida do usuário para vários alvos, os curando instantaneamente.' },
  { nome: 'Purgatório', circulo: 2, elemento: 'Sangue', descricao: 'Área de sangue deixa alvos vulneráveis a dano e causa dor a quem tentar sair.' },
  { nome: 'Vomitar Pestes', circulo: 2, elemento: 'Sangue', descricao: 'Vomita um enxame de pequenas criaturas de Sangue.' },

  // 2º CÍRCULO — MEDO
  { nome: 'Proteção contra Rituais', circulo: 2, elemento: 'Medo', descricao: 'Alvo recebe resistência contra efeitos e criaturas paranormais.' },
  { nome: 'Rejeitar Névoa', circulo: 2, elemento: 'Medo', descricao: 'Concede bônus em testes de resistência contra rituais.' },
  { nome: 'Dissipar Ritual', circulo: 2, elemento: 'Medo', descricao: 'Cancela os efeitos de rituais em um alvo ou área.' },

  // 3º CÍRCULO — CONHECIMENTO
  { nome: 'Alterar Memória', circulo: 3, elemento: 'Conhecimento', descricao: 'Pode apagar ou modificar a memória recente do alvo.' },
  { nome: 'Contato Paranormal', circulo: 3, elemento: 'Conhecimento', descricao: 'Você barganha com o Outro Lado para obter ajuda.' },
  { nome: 'Mergulho Mental', circulo: 3, elemento: 'Conhecimento', descricao: 'Infiltra-se na mente do alvo para vasculhar seus pensamentos.' },
  { nome: 'Vidência', circulo: 3, elemento: 'Conhecimento', descricao: 'Pode observar e ouvir um alvo à distância.' },

  // 3º CÍRCULO — ENERGIA
  { nome: 'Convocação Instantânea', circulo: 3, elemento: 'Energia', descricao: 'Teletransporta um objeto marcado para suas mãos.' },
  { nome: 'Salto Fantasma', circulo: 3, elemento: 'Energia', descricao: 'Teletransporta você e outros seres para um ponto dentro do alcance.' },
  { nome: 'Transfigurar Água', circulo: 3, elemento: 'Energia', descricao: 'Água e gelo se comportam de forma caótica.' },
  { nome: 'Transfigurar Terra', circulo: 3, elemento: 'Energia', descricao: 'Rochas, lama e areia se comportam de forma caótica.' },

  // 3º CÍRCULO — MORTE
  { nome: 'Âncora Temporal', circulo: 3, elemento: 'Morte', descricao: 'Impede o alvo de se afastar de um ponto.' },
  { nome: 'Poeira da Podridão', circulo: 3, elemento: 'Morte', descricao: 'Nuvem de poeira apodrece tudo que toca.' },
  { nome: 'Tentáculos de Lodo', circulo: 3, elemento: 'Morte', descricao: 'Tentáculos pretos atacam e agarram seres na área.' },
  { nome: 'Zerar Entropia', circulo: 3, elemento: 'Morte', descricao: 'O alvo fica lento ou paralisado.' },

  // 3º CÍRCULO — SANGUE
  { nome: 'Ferver Sangue', circulo: 3, elemento: 'Sangue', descricao: 'Faz o sangue do alvo entrar em ebulição, causando dano e deixando-o fraco.' },
  { nome: 'Forma Monstruosa', circulo: 3, elemento: 'Sangue', descricao: 'Você assume a aparência e forma de uma criatura monstruosa.' },

  // 4º CÍRCULO — CONHECIMENTO
  { nome: 'Controle Mental', circulo: 4, elemento: 'Conhecimento', descricao: 'Faz com que a mente da vítima seja controlada por outra pessoa.' },
  { nome: 'Inexistir', circulo: 4, elemento: 'Conhecimento', descricao: 'Você toca um alvo e o apaga completamente da existência.' },
  { nome: 'Possessão', circulo: 4, elemento: 'Conhecimento', descricao: 'Transfere sua consciência para o corpo do alvo.' },

  // 4º CÍRCULO — ENERGIA
  { nome: 'Alterar Destino', circulo: 4, elemento: 'Energia', descricao: 'Enxerga o futuro próximo, podendo alterar o resultado de um teste.' },
  { nome: 'Deflagração de Energia', circulo: 4, elemento: 'Energia', descricao: 'Explosão de energia bruta causa dano e afeta rituais e itens amaldiçoados.' },
  { nome: 'Teletransporte', circulo: 4, elemento: 'Energia', descricao: 'Teletransporta você e outros seres.' },

  // 4º CÍRCULO — MORTE
  { nome: 'Convocar o Algoz', circulo: 4, elemento: 'Morte', descricao: 'Conjura um ser cadavérico que persegue e tenta matar o alvo.' },
  { nome: 'Distorção Temporal', circulo: 4, elemento: 'Morte', descricao: 'Você age livremente por um curto período de tempo.' },
  { nome: 'Fim Inevitável', circulo: 4, elemento: 'Morte', descricao: 'Abre uma ruptura no espaço que suga tudo ao redor.' },

  // 4º CÍRCULO — SANGUE
  { nome: 'Capturar o Coração', circulo: 4, elemento: 'Sangue', descricao: 'Manipula as emoções e vontades do alvo, fazendo dele seu aliado.' },
  { nome: 'Invólucro de Carne', circulo: 4, elemento: 'Sangue', descricao: 'Criar um clone de carne e sangue com as mesmas estatísticas do alvo.' },
  { nome: 'Vínculo de Sangue', circulo: 4, elemento: 'Sangue', descricao: 'Alvo sofre todo dano e efeitos negativos que você sofrer.' },

  // 4º CÍRCULO — MEDO
  { nome: 'Canalizar o Medo', circulo: 4, elemento: 'Medo', descricao: 'Transfere parte de seu poder paranormal para um alvo.' },
  { nome: 'Conhecendo o Medo', circulo: 4, elemento: 'Medo', descricao: 'Manifesta o Medo absoluto na mente do alvo.' },
  { nome: 'Lâmina do Medo', circulo: 4, elemento: 'Medo', descricao: 'Golpeia o alvo com uma lâmina de medo puro.' },
  { nome: 'Medo Tangível', circulo: 4, elemento: 'Medo', descricao: 'Recebe uma série de imunidades.' },
  { nome: 'Presença do Medo', circulo: 4, elemento: 'Medo', descricao: 'Você assume uma forma impossível dentro da Realidade.' },
]

async function seedRituais() {
  for (const ritual of rituais) {
    await prisma.ritual.create({
      data: {
        ...ritual,
        custoPE: CUSTO_POR_CIRCULO[ritual.circulo as 1 | 2 | 3 | 4],
        origem: 'OFICIAL',
        livro: 'Livro Base',
      }
    })
  }
  console.log(`${rituais.length} rituais cadastrados.`)
}

const itens = [
  // ARMAS SIMPLES — Corpo a Corpo Leves
  { nome: 'Coronhada', categoria: '—', dano: '1d4/1d6', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 0 },
  { nome: 'Faca', categoria: '0', dano: '1d4', critico: '19', alcance: 'Curto', tipoDano: 'C', espacos: 1 },
  { nome: 'Martelo', categoria: '0', dano: '1d6', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 1 },
  { nome: 'Punhal', categoria: '0', dano: '1d4', critico: 'x3', alcance: '—', tipoDano: 'P', espacos: 1 },
  // Corpo a Corpo Uma Mão
  { nome: 'Bastão', categoria: '0', dano: '1d6/1d8', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 1 },
  { nome: 'Machete', categoria: '0', dano: '1d6', critico: '19', alcance: '—', tipoDano: 'C', espacos: 1 },
  { nome: 'Lança', categoria: '0', dano: '1d6', critico: 'x2', alcance: 'Curto', tipoDano: 'P', espacos: 1 },
  // Corpo a Corpo Duas Mãos
  { nome: 'Cajado', categoria: '0', dano: '1d6/1d6', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 2 },
  // Disparo Duas Mãos
  { nome: 'Arco', categoria: '0', dano: '1d6', critico: 'x3', alcance: 'Médio', tipoDano: 'P', espacos: 2 },
  { nome: 'Besta', categoria: '0', dano: '1d8', critico: '19', alcance: 'Médio', tipoDano: 'P', espacos: 2 },
  // Fogo Leves
  { nome: 'Pistola', categoria: 'I', dano: '1d12', critico: '18', alcance: 'Curto', tipoDano: 'B', espacos: 1 },
  { nome: 'Revólver', categoria: 'I', dano: '2d6', critico: '19/x3', alcance: 'Curto', tipoDano: 'B', espacos: 1 },
  // Fogo Duas Mãos
  { nome: 'Fuzil de caça', categoria: 'I', dano: '2d8', critico: '19/x3', alcance: 'Médio', tipoDano: 'B', espacos: 2 },

  // ARMAS TÁTICAS — Corpo a Corpo Leves
  { nome: 'Machadinha', categoria: '0', dano: '1d6', critico: 'x3', alcance: 'Curto', tipoDano: 'C', espacos: 1 },
  { nome: 'Nunchaku', categoria: '0', dano: '1d8', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 1 },
  // Corpo a Corpo Uma Mão
  { nome: 'Corrente', categoria: '0', dano: '1d8', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 1 },
  { nome: 'Espada', categoria: 'I', dano: '1d8/1d10', critico: '19', alcance: '—', tipoDano: 'C', espacos: 1 },
  { nome: 'Florete', categoria: 'I', dano: '1d6', critico: '18', alcance: '—', tipoDano: 'C', espacos: 1 },
  { nome: 'Machado', categoria: 'I', dano: '1d8', critico: 'x3', alcance: '—', tipoDano: 'C', espacos: 1 },
  { nome: 'Maça', categoria: 'I', dano: '2d4', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 1 },
  // Corpo a Corpo Duas Mãos
  { nome: 'Acha', categoria: 'I', dano: '1d12', critico: 'x3', alcance: '—', tipoDano: 'C', espacos: 2 },
  { nome: 'Gadanho', categoria: 'I', dano: '2d4', critico: 'x4', alcance: '—', tipoDano: 'C', espacos: 2 },
  { nome: 'Katana', categoria: 'I', dano: '1d10', critico: '19', alcance: '—', tipoDano: 'C', espacos: 2 },
  { nome: 'Marreta', categoria: 'I', dano: '3d4', critico: 'x2', alcance: '—', tipoDano: 'I', espacos: 2 },
  { nome: 'Montante', categoria: 'I', dano: '2d6', critico: '19', alcance: '—', tipoDano: 'C', espacos: 2 },
  { nome: 'Motosserra', categoria: 'I', dano: '3d6', critico: 'x2', alcance: '—', tipoDano: 'C', espacos: 2 },
  // Disparo Duas Mãos
  { nome: 'Arco composto', categoria: 'I', dano: '1d10', critico: 'x3', alcance: 'Médio', tipoDano: 'P', espacos: 2 },
  { nome: 'Balestra', categoria: 'I', dano: '1d12', critico: '19', alcance: 'Médio', tipoDano: 'P', espacos: 2 },
  // Fogo Uma Mão
  { nome: 'Submetralhadora', categoria: 'I', dano: '2d6', critico: '19/x3', alcance: 'Curto', tipoDano: 'B', espacos: 1 },
  // Fogo Duas Mãos
  { nome: 'Espingarda', categoria: 'I', dano: '4d6', critico: 'x3', alcance: 'Curto', tipoDano: 'B', espacos: 2 },
  { nome: 'Fuzil de assalto', categoria: 'II', dano: '2d10', critico: '19/x3', alcance: 'Médio', tipoDano: 'B', espacos: 2 },
  { nome: 'Fuzil de precisão', categoria: 'III', dano: '2d10', critico: '19/x3', alcance: 'Longo', tipoDano: 'B', espacos: 2 },

  // ARMAS PESADAS
  { nome: 'Bazuca', categoria: 'III', dano: '10d8', critico: 'x2', alcance: 'Médio', tipoDano: 'I', espacos: 2 },
  { nome: 'Lança-chamas', categoria: 'III', dano: '6d6', critico: 'x2', alcance: 'Curto', tipoDano: 'Fogo', espacos: 2 },
  { nome: 'Metralhadora', categoria: 'II', dano: '2d12', critico: '19/x3', alcance: 'Médio', tipoDano: 'B', espacos: 2 },

  // MUNIÇÕES
  { nome: 'Balas curtas', categoria: '0', espacos: 1 },
  { nome: 'Balas longas', categoria: 'I', espacos: 1 },
  { nome: 'Cartuchos', categoria: 'I', espacos: 1 },
  { nome: 'Combustível', categoria: 'I', espacos: 1 },
  { nome: 'Flechas', categoria: '0', espacos: 1 },
  { nome: 'Foguete', categoria: 'I', espacos: 1 },

  // PROTEÇÕES (usam "dano" pra guardar o bônus de Defesa, já que não há campo próprio)
  { nome: 'Proteção Leve', categoria: 'I', descricao: 'Defesa +5', espacos: 2 },
  { nome: 'Proteção Pesada', categoria: 'II', descricao: 'Defesa +10', espacos: 5 },
  { nome: 'Escudo', categoria: 'I', descricao: 'Defesa +2', espacos: 2 },

  // EQUIPAMENTO GERAL — Acessórios
  { nome: 'Kit de perícia', categoria: '0', espacos: 1 },
  { nome: 'Utensílio', categoria: 'I', espacos: 1 },
  { nome: 'Vestimenta', categoria: 'I', espacos: 1 },
  // Explosivos
  { nome: 'Granada de atordoamento', categoria: '0', espacos: 1 },
  { nome: 'Granada de fragmentação', categoria: 'I', espacos: 1 },
  { nome: 'Granada de fumaça', categoria: '0', espacos: 1 },
  { nome: 'Granada incendiária', categoria: 'I', espacos: 1 },
  { nome: 'Mina antipessoal', categoria: 'I', espacos: 1 },
  // Itens Operacionais
  { nome: 'Algemas', categoria: '0', espacos: 1 },
  { nome: 'Arpéu', categoria: '0', espacos: 1 },
  { nome: 'Bandoleira', categoria: 'I', espacos: 1 },
  { nome: 'Binóculos', categoria: '0', espacos: 1 },
  { nome: 'Bloqueador de sinal', categoria: 'I', espacos: 1 },
  { nome: 'Cicatrizante', categoria: 'I', espacos: 1 },
  { nome: 'Corda', categoria: '0', espacos: 1 },
  { nome: 'Equipamento de sobrevivência', categoria: '0', espacos: 2 },
  { nome: 'Lanterna tática', categoria: 'I', espacos: 1 },
  { nome: 'Máscara de gás', categoria: '0', espacos: 1 },
  { nome: 'Mochila militar', categoria: 'I', espacos: 0 },
  { nome: 'Óculos de visão térmica', categoria: 'I', espacos: 1 },
  { nome: 'Pé de cabra', categoria: '0', espacos: 1 },
  { nome: 'Pistola de dardos', categoria: 'I', espacos: 1 },
  { nome: 'Pistola sinalizadora', categoria: '0', espacos: 1 },
  { nome: 'Soqueira', categoria: '0', espacos: 1 },
  { nome: 'Spray de pimenta', categoria: 'I', espacos: 1 },
  { nome: 'Taser', categoria: 'I', espacos: 1 },
  { nome: 'Traje hazmat', categoria: 'I', espacos: 2 },

  // ITENS PARANORMAIS
  { nome: 'Amarras de (elemento)', categoria: 'II', espacos: 1 },
  { nome: 'Câmara de aura paranormal', categoria: 'II', espacos: 1 },
  { nome: 'Componentes ritualísticos de (elemento)', categoria: '0', espacos: 1 },
  { nome: 'Emissor de pulsos paranormais', categoria: 'II', espacos: 1 },
  { nome: 'Escuta de ruídos paranormais', categoria: 'II', espacos: 1 },
  { nome: 'Scanner de manifestação paranormal de (elemento)', categoria: 'II', espacos: 1 },
]

async function seedItens() {
  for (const item of itens) {
    await prisma.item.create({
      data: {
        ...item,
        origem: 'OFICIAL',
        livro: 'Livro Base',
      }
    })
  }
  console.log(`${itens.length} itens cadastrados.`)
}

async function main() {
  for (const pericia of pericias) {
    await prisma.pericia.upsert({
      where: { nome: pericia.nome },
      update: {},
      create: { ...pericia, origem: 'OFICIAL' }
    })
  }

  await seedRituais()
  await seedItens()
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
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// ============================
// SUBJECT CONFIGURATIONS
// ============================

const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Matematica',
    emoji: '🧮',
    tutorName: 'MathMente',
    colors: { primary: '#6C5CE7', secondary: '#A855F7', bg: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0E6 100%)', header: 'linear-gradient(135deg, #6C5CE7, #A855F7)' },
    systemPrompt: 'Voce e a MathMente, uma tutora de matematica super paciente e divertida para o 7o ano. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples e acessivel. 5) Sempre encoraje.',
    parentSystemPrompt: 'Voce e um consultor pedagogico especializado em matematica. Ajude o responsavel a criar estrategias de estudo. Seja pratico e objetivo.',
    topics: [
      { id: 1, name: 'Sequencias', emoji: '🔢', desc: 'Sequencias numericas' },
      { id: 2, name: 'Primos e Compostos', emoji: '⭐', desc: 'Numeros primos e compostos' },
      { id: 3, name: 'Multiplos e Divisores', emoji: '✖️', desc: 'Multiplos e divisores' },
      { id: 4, name: 'MMC e MDC', emoji: '🎯', desc: 'Minimo multiplo comum e maximo divisor comum' },
      { id: 5, name: 'Divisibilidade', emoji: '📏', desc: 'Criterios de divisibilidade' },
      { id: 6, name: 'Numeros Inteiros', emoji: '➕➖', desc: 'Conjunto dos numeros inteiros, adicao e subtracao' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de forma simples, com exemplos do dia a dia. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de um exemplo pratico e resolvido passo a passo deste tema. Use numeros simples.' },
      { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar este conceito facilmente.' },
      { label: '🎮 Quiz', prompt: 'Crie um quiz rapido com 3 questoes de multipla escolha sobre este tema. Formate bem.' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema.' }
    ],
    parentQuickActions: [
      ['Estrategias de Estudo', 'Quais as melhores estrategias de estudo para matematica?'],
      ['Plano de Revisao', 'Crie um plano de revisao de 3 dias para o T1 de matematica'],
      ['Exercicios', 'Sugira exercicios praticos e rapidos sobre numeros inteiros'],
      ['Desempenho', 'Como avaliar se o aluno esta progredindo nos estudos?']
    ],
    test: { name: 'T1 Matematica', date: '2026-04-10', details: '15 questoes: 3 objetivas + 12 desenvolvimento (peso 0,2 cada)' }
  },
  portuguese: {
    id: 'portuguese',
    name: 'Portugues',
    emoji: '📖',
    tutorName: 'LetraMente',
    colors: { primary: '#E17055', secondary: '#FDCB6E', bg: 'linear-gradient(135deg, #FFF8F0 0%, #FFF5F5 100%)', header: 'linear-gradient(135deg, #E17055, #FDCB6E)' },
    systemPrompt: 'Voce e a LetraMente, uma tutora de portugues super paciente e divertida para o 7o ano. O conteudo do T1 e do livro "Entre Herois" Cap 1. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples e acessivel. 5) Sempre encoraje. 6) De exemplos com frases do dia a dia. 7) Quando explicar gramatica, destaque a palavra-chave com MAIUSCULAS. 8) A prova tera 12 objetivas (4 alternativas), 3 esquematicas e 1 discursiva-argumentativa. Pratique esses formatos.',
    parentSystemPrompt: 'Voce e um consultor pedagogico especializado em lingua portuguesa (7o ano). O T1 cobre: Conto lendario, Pontuacao do dialogo, Sintagma, Formacao de palavras (prefixo de negacao) e leitura "Nos: uma antologia de literatura indigena". Livro "Entre Herois" Cap 1. Prova: 12 objetivas (peso 0,15), 3 esquematicas (peso 0,2) e 1 discursiva-argumentativa (peso 0,6). Ajude o responsavel com estrategias praticas.',
    topics: [
      { id: 1, name: 'Conto Lendario', emoji: '🐉', desc: 'Genero conto lendario - Semana 3, Cap 1 (Entre Herois), pag 7-14' },
      { id: 2, name: 'Pontuacao do Dialogo', emoji: '💬', desc: 'Pontuacao em dialogos (travessao, virgula, dois-pontos) - Semana 4, pag 18-20' },
      { id: 3, name: 'Sintagma', emoji: '🧩', desc: 'Sintagma nominal e verbal, estrutura das frases - Semanas 5-6, pag 25-26' },
      { id: 4, name: 'Prefixo de Negacao', emoji: '🚫', desc: 'Formacao de palavras com prefixos de negacao (in-, des-, a-) - Semana 7, pag 28-29' },
      { id: 5, name: 'Literatura Indigena', emoji: '🪶', desc: 'Leitura "Nos: uma antologia de literatura indigena" - interpretacao e contexto' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de portugues de forma simples, com exemplos do dia a dia. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de exemplos praticos deste tema usando frases simples do cotidiano. Destaque as palavras importantes.' },
      { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar esta regra de portugues facilmente.' },
      { label: '🎮 Quiz', prompt: 'Crie um quiz no formato da prova: 3 questoes objetivas com 4 alternativas (a, b, c, d) sobre este tema. Formate bem e diga a resposta depois.' },
      { label: '📝 Esquematica', prompt: 'Crie uma questao esquematica (preencher, ligar, completar) sobre este tema, no estilo da prova do 7o ano.' },
      { label: '✍️ Discursiva', prompt: 'Crie uma questao discursiva-argumentativa sobre este tema e me ajude a montar uma resposta passo a passo. Essa e a questao que vale mais na prova (peso 0,6)!' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema de portugues para o T1.' }
    ],
    parentQuickActions: [
      ['Estrategias de Estudo', 'Quais as melhores estrategias para estudar Conto Lendario, Pontuacao de Dialogo, Sintagma e Prefixos de Negacao?'],
      ['Plano Revisao Hoje', 'Crie um plano de revisao para HOJE a noite cobrindo os 5 topicos do T1 de portugues. A prova e amanha!'],
      ['Simular Prova', 'Monte um simulado completo no formato da prova: 4 objetivas, 1 esquematica e 1 discursiva sobre os topicos do T1'],
      ['Dicas Discursiva', 'Como ajudar o aluno a se preparar para a questao discursiva-argumentativa que vale peso 0,6?']
    ],
    test: { name: 'T1 Portugues', date: '2026-04-08', details: '7o ano - Profa Monica | 12 objetivas (peso 0,15) + 3 esquematicas (peso 0,2) + 1 discursiva (peso 0,6) | 4o e 5o periodos' }
  },
  history: {
    id: 'history',
    name: 'Historia',
    emoji: '📜',
    tutorName: 'HistoriaMente',
    colors: { primary: '#8B5E3C', secondary: '#D4A574', bg: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)', header: 'linear-gradient(135deg, #8B5E3C, #D4A574)' },
    systemPrompt: 'Voce e a HistoriaMente, uma tutora de historia super paciente e divertida para o 7o ano. O conteudo do T1 cobre: Do Imperio Romano ao Mundo Medieval - auge de Roma (Otavio Augusto, Pax Romana), ascensao do Cristianismo (Edito de Milao 313, Edito de Tessalonica 380), crise do seculo III (escassez de escravos, colonato, ruralizacao), povos germanicos ("barbaros", hunos, invasoes), divisao de Roma (395 Teodosio, queda 476 Odoacro), formacao medieval (reinos germanicos, Clovis e os Francos), Imperio Carolingio (Carlos Martel, Pepino o Breve, Carlos Magno coroado 800), Tratado de Verdun 843 (divisao em 3). REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples e acessivel. 5) Sempre encoraje. 6) Use linhas do tempo e comparacoes para facilitar. 7) Destaque DATAS e NOMES importantes em MAIUSCULAS.',
    parentSystemPrompt: 'Voce e um consultor pedagogico especializado em historia (7o ano). O T1 cobre: Imperio Romano (auge, Otavio Augusto, Pax Romana), Cristianismo (perseguicao, Edito de Milao 313, Tessalonica 380), Crise do sec III (escassez escravos, colonato, ruralizacao), Povos Germanicos (barbaros, hunos, invasoes), Divisao de Roma (395 Teodosio, queda 476), Formacao Medieval (reinos germanicos, Clovis, Francos), Imperio Carolingio (Carlos Martel, Pepino, Carlos Magno 800), Tratado de Verdun 843. Ajude o responsavel com estrategias praticas. Foco na relacao entre crise do escravismo, ruralizacao e formacao dos reinos germanicos.',
    topics: [
      { id: 1, name: 'Auge de Roma', emoji: '🏛️', desc: 'Otavio Augusto (27 a.C.), Pax Romana, centralizacao, latim, estradas e infraestrutura' },
      { id: 2, name: 'Cristianismo', emoji: '✝️', desc: 'Jesus, perseguicoes, Edito de Milao (313 Constantino), Edito de Tessalonica (380 Teodosio)' },
      { id: 3, name: 'Crise do Seculo III', emoji: '📉', desc: 'Fim das conquistas, escassez de escravos, impostos, inflacao, ruralizacao e colonato' },
      { id: 4, name: 'Povos Germanicos', emoji: '⚔️', desc: '"Barbaros", trocas comerciais, pressao dos Hunos, invasoes (visigodos, ostrogodos, francos)' },
      { id: 5, name: 'Divisao e Queda de Roma', emoji: '💔', desc: 'Divisao 395 (Teodosio), Ocidente x Oriente, queda 476 (Odoacro depoe Romulo Augusto)' },
      { id: 6, name: 'Mundo Medieval', emoji: '🏰', desc: 'Alta Idade Media, reinos germanicos, Clovis e os Francos, conversao ao cristianismo (496)' },
      { id: 7, name: 'Imperio Carolingio', emoji: '👑', desc: 'Carlos Martel (732), Pepino o Breve, Carlos Magno coroado imperador (800), Renascimento Carolingio' },
      { id: 8, name: 'Tratado de Verdun', emoji: '📄', desc: 'Divisao do imperio em 843: Carlos Calvo (Franca), Luis Germanico (Alemanha), Lotario (centro)' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de historia de forma simples, com uma linha do tempo visual. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de exemplos concretos e curiosidades sobre este periodo historico. Use comparacoes com coisas do dia a dia para facilitar.' },
      { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar as datas e nomes importantes deste tema.' },
      { label: '🎮 Quiz', prompt: 'Crie um quiz rapido com 3 questoes de multipla escolha sobre este tema de historia. Formate bem com 4 alternativas cada.' },
      { label: '📅 Linha do Tempo', prompt: 'Monte uma linha do tempo visual e resumida dos eventos mais importantes deste tema, com datas e o que aconteceu em cada uma.' },
      { label: '🔗 Causa e Efeito', prompt: 'Explique as relacoes de CAUSA e EFEITO deste tema. O que causou o que? Use setas ou numeracao para ficar claro.' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos. Use uma historia ou analogia.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema para o T1 de historia.' }
    ],
    parentQuickActions: [
      ['Estrategias de Estudo', 'Quais as melhores estrategias para estudar historia (Imperio Romano ao Medieval)? Foco em datas e sequencia de eventos.'],
      ['Plano Revisao Hoje', 'Crie um plano de revisao para hoje cobrindo os 8 topicos do T1 de historia (Roma ate Tratado de Verdun). A prova e amanha!'],
      ['Simular Prova', 'Monte um simulado de historia com questoes sobre: auge de Roma, Cristianismo, crise sec III, povos germanicos, queda de Roma, mundo medieval, Carolingios e Tratado de Verdun.'],
      ['Conexoes-Chave', 'Explique as conexoes entre crise do escravismo, ruralizacao e formacao dos reinos germanicos - esse e o ponto central da transicao Antiguidade-Medieval.']
    ],
    test: { name: 'T1 Historia', date: '2026-04-09', details: '7o ano | Do Imperio Romano ao Mundo Medieval | Foco: crise do escravismo, ruralizacao e formacao dos reinos germanicos' }
  }
};

// ============================
// EXERCISE LISTS (Extracted from ionica platform)
// ============================

const EXERCISE_LISTS = [
  {
    id: 'lista1',
    title: 'Lista 1 - Sondagem/Revisao',
    desc: 'Fracoes e decimais (revisao)',
    emoji: '📝',
    questions: [
      { id: 1, text: 'Calcule: a) 2/5 + 1/3  b) 7/8 - 1/4  c) 3/4 x 2/5  d) 5/6 ÷ 2/3', type: 'open', answer: 'a) 11/15  b) 5/8  c) 6/20 = 3/10  d) 15/12 = 5/4' },
      { id: 2, text: 'Transforme em numero decimal: a) 3/4  b) 1/5  c) 7/8  d) 2/3', type: 'open', answer: 'a) 0,75  b) 0,2  c) 0,875  d) 0,666...' },
      { id: 3, text: 'Transforme em fracao: a) 0,25  b) 0,8  c) 0,125  d) 1,5', type: 'open', answer: 'a) 1/4  b) 4/5  c) 1/8  d) 3/2' },
      { id: 4, text: 'Maria comeu 2/8 de uma pizza e Joao comeu 3/8. Que fracao da pizza foi comida? Quanto sobrou?', type: 'open', answer: 'Comida: 2/8 + 3/8 = 5/8. Sobrou: 3/8' },
      { id: 5, text: 'Um terreno tem 3/5 de area gramada. Se o terreno tem 200 m², qual a area gramada?', type: 'open', answer: '3/5 x 200 = 120 m²' },
      { id: 6, text: 'Coloque em ordem crescente: 1/2, 3/4, 1/3, 2/5, 5/6', type: 'open', answer: '1/3 < 2/5 < 1/2 < 3/4 < 5/6' }
    ]
  },
  {
    id: 'lista2',
    title: 'Lista 2 - MMC e MDC',
    desc: 'Problemas de minimo multiplo comum e maximo divisor comum',
    emoji: '🎯',
    questions: [
      { id: 1, text: 'Dois onibus partem do mesmo terminal. O primeiro a cada 12 min e o segundo a cada 18 min. Se partiram juntos as 8h, quando partirao juntos novamente?', type: 'open', answer: 'MMC(12,18) = 36. Partirao juntos as 8h36min.' },
      { id: 2, text: 'Uma floricultura recebeu 36 rosas e 48 margaridas. Quer montar buques iguais, com maior numero de flores possivel. Quantas flores em cada buque?', type: 'open', answer: 'MDC(36,48) = 12. Cada buque tera 12 flores (3 rosas e 4 margaridas).' },
      { id: 3, text: 'Ana vai a biblioteca a cada 4 dias e Bia a cada 6 dias. Se foram juntas hoje, daqui a quantos dias se encontrarao la novamente?', type: 'open', answer: 'MMC(4,6) = 12. Daqui a 12 dias.' },
      { id: 4, text: 'Um relogio toca a cada 15 min e outro a cada 20 min. Se tocaram juntos ao meio-dia, quando tocarao juntos novamente?', type: 'open', answer: 'MMC(15,20) = 60 min. Tocarao juntos as 13h.' },
      { id: 5, text: 'Tenho 24 balas de morango e 32 de chocolate. Quero distribuir igualmente em saquinhos sem sobrar nenhuma. Qual o maior numero de saquinhos?', type: 'open', answer: 'MDC(24,32) = 8 saquinhos (3 morango e 4 chocolate cada).' },
      { id: 6, text: 'Tres sinais luminosos piscam a cada 2s, 3s e 5s. Se piscaram juntos, depois de quantos segundos piscarao juntos novamente?', type: 'open', answer: 'MMC(2,3,5) = 30 segundos.' },
      { id: 7, text: 'Uma loja vende pacotes de suco com 6 unidades e pacotes de biscoito com 8. Qual o menor numero de sucos e biscoitos para ter a mesma quantidade?', type: 'open', answer: 'MMC(6,8) = 24. Precisa de 4 pacotes de suco e 3 de biscoito.' }
    ]
  },
  {
    id: 'lista3',
    title: 'Lista 3 - Numeros Inteiros',
    desc: 'Conceitos iniciais e adicao algebrica',
    emoji: '➕➖',
    questions: [
      { id: 1, text: 'Determine o valor absoluto (modulo) de: a) |+7|  b) |-3|  c) |0|  d) |-15|  e) |+22|', type: 'open', answer: 'a) 7  b) 3  c) 0  d) 15  e) 22' },
      { id: 2, text: 'Determine o oposto (simetrico) de: a) +8  b) -5  c) +12  d) -20  e) 0', type: 'open', answer: 'a) -8  b) +5  c) -12  d) +20  e) 0' },
      { id: 3, text: 'Coloque em ordem crescente: -7, +3, -1, 0, +5, -4, +2', type: 'open', answer: '-7 < -4 < -1 < 0 < +2 < +3 < +5' },
      { id: 4, text: 'Coloque em ordem decrescente: +6, -2, -8, +1, 0, -5, +4', type: 'open', answer: '+6 > +4 > +1 > 0 > -2 > -5 > -8' },
      { id: 5, text: 'Compare usando > , < ou = : a) -3 ___ +2  b) -5 ___ -1  c) |+4| ___ |-4|  d) 0 ___ -7', type: 'open', answer: 'a) -3 < +2  b) -5 < -1  c) |+4| = |-4|  d) 0 > -7' },
      { id: 6, text: 'Calcule: a) (+5) + (+3)  b) (-4) + (-6)  c) (+8) + (-3)  d) (-7) + (+2)  e) (-9) + (+9)', type: 'open', answer: 'a) +8  b) -10  c) +5  d) -5  e) 0' },
      { id: 7, text: 'Calcule: a) (+10) - (+4)  b) (-3) - (-8)  c) (+6) - (+9)  d) (-5) - (+3)  e) 0 - (-4)', type: 'open', answer: 'a) +6  b) +5  c) -3  d) -8  e) +4' },
      { id: 8, text: 'Simplifique a expressao: -3 + 7 - 2 + 5 - 8 + 1', type: 'open', answer: 'Positivos: 7 + 5 + 1 = 13. Negativos: -3 - 2 - 8 = -13. Resultado: 0' },
      { id: 9, text: 'A temperatura era de 3°C e caiu 8°C. Qual a temperatura final?', type: 'open', answer: '3 - 8 = -5°C' },
      { id: 10, text: 'Um submarino esta a -40m. Subiu 15m e depois desceu 8m. Qual a profundidade final?', type: 'open', answer: '-40 + 15 - 8 = -33m' },
      { id: 11, text: 'No banco, Pedro tinha R$250. Fez um saque de R$300. Qual seu saldo?', type: 'open', answer: '250 - 300 = -50 (devendo R$50)' },
      { id: 12, text: 'Calcule: a) (-2) + (+5) - (-3) + (-4) - (+1)  b) |(-3) + (+7)| - |(-2) - (+4)|', type: 'open', answer: 'a) -2 + 5 + 3 - 4 - 1 = +1  b) |+4| - |-6| = 4 - 6 = -2' }
    ]
  },
  {
    id: 'lista5',
    title: 'Lista 5 - Revisao T1',
    desc: 'Revisao completa para a prova T1 (com gabarito)',
    emoji: '🏆',
    questions: [
      { id: 1, text: 'Escreva os 5 primeiros termos da sequencia cujo termo geral e an = 3n - 1', type: 'open', answer: 'a1=2, a2=5, a3=8, a4=11, a5=14' },
      { id: 2, text: 'Qual o proximo termo da sequencia: 2, 6, 18, 54, ...?', type: 'choice', options: ['a) 108', 'b) 162', 'c) 72', 'd) 216'], answer: 'b) 162 (multiplicando por 3)' },
      { id: 3, text: 'Classifique em primo ou composto: a) 17  b) 21  c) 29  d) 39  e) 2  f) 51', type: 'open', answer: 'Primos: 17, 29, 2. Compostos: 21 (3x7), 39 (3x13), 51 (3x17)' },
      { id: 4, text: 'Decomponha em fatores primos: a) 60  b) 84  c) 120', type: 'open', answer: 'a) 60 = 2² x 3 x 5  b) 84 = 2² x 3 x 7  c) 120 = 2³ x 3 x 5' },
      { id: 5, text: 'Determine todos os divisores de 36.', type: 'open', answer: 'D(36) = {1, 2, 3, 4, 6, 9, 12, 18, 36}' },
      { id: 6, text: 'Calcule: a) MMC(12, 18)  b) MDC(24, 36)  c) MMC(8, 12, 15)', type: 'open', answer: 'a) MMC = 36  b) MDC = 12  c) MMC = 120' },
      { id: 7, text: 'Dois alarmes tocam: um a cada 45min e outro a cada 60min. Se tocaram juntos as 7h, quando tocarao juntos novamente?', type: 'open', answer: 'MMC(45,60) = 180min = 3h. Tocarao as 10h.' },
      { id: 8, text: 'Uma loja tem 72 camisetas e 48 calcas. Quer montar kits iguais usando todas. Qual o maior numero de kits?', type: 'open', answer: 'MDC(72,48) = 24 kits (3 camisetas e 2 calcas cada).' },
      { id: 9, text: 'Verifique se 3456 e divisivel por 2, 3, 4, 5, 6, 8 e 9.', type: 'open', answer: 'Div por 2 (par), 3 (3+4+5+6=18), 4 (56÷4=14), 6 (div por 2 e 3), 8 (456÷8=57). NAO por 5, 9.' },
      { id: 10, text: 'Represente na reta numerica e coloque em ordem crescente: +3, -5, -1, +4, 0, -3, +2', type: 'open', answer: '-5 < -3 < -1 < 0 < +2 < +3 < +4' },
      { id: 11, text: 'Calcule: a) |(-8) + (+3)|  b) |-5| + |+5|  c) -|+7| + |-3|', type: 'open', answer: 'a) |-5| = 5  b) 5 + 5 = 10  c) -7 + 3 = -4' },
      { id: 12, text: 'Determine o oposto de: a) +13  b) -8  c) |(-6)|  d) -(+4)', type: 'open', answer: 'a) -13  b) +8  c) oposto de 6 = -6  d) oposto de -4 = +4' },
      { id: 13, text: 'A temperatura de uma cidade era -3°C pela manha. Subiu 8°C ao meio-dia e caiu 12°C a noite. Qual a temperatura final?', type: 'open', answer: '-3 + 8 - 12 = -7°C' }
    ]
  }
];

// ============================
// SHARED COMPONENTS
// ============================

function ChatBubble({ role, content, primaryColor }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: 12
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: role === 'user' ? (primaryColor || '#6C5CE7') : '#ffffff',
        color: role === 'user' ? '#fff' : '#2d3436',
        fontSize: 15,
        lineHeight: 1.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        whiteSpace: 'pre-wrap'
      }}>
        {content}
      </div>
    </div>
  );
}

// ============================
// EXERCISE VIEW
// ============================

function ExerciseView({ onBack, onAskAI }) {
  const [selectedList, setSelectedList] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState({});

  if (!selectedList) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack} style={{ background: 'rgba(108,92,231,0.1)', border: 'none', borderRadius: 8, color: '#6C5CE7', padding: '8px 14px', cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>
          ← Voltar
        </button>
        <h2 style={{ color: '#2d3436', marginBottom: 4 }}>📚 Listas de Exercicios</h2>
        <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>Pratique para o T1 de Matematica</p>
        {EXERCISE_LISTS.map(list => {
          const done = Object.keys(completed).filter(k => k.startsWith(list.id)).length;
          const total = list.questions.length;
          return (
            <button key={list.id} onClick={() => { setSelectedList(list); setCurrentQ(0); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); }} style={{
              display: 'block', width: '100%', textAlign: 'left', background: '#fff', border: '2px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{list.emoji} {list.title}</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>{list.desc}</div>
                  <div style={{ fontSize: 12, color: '#6C5CE7', marginTop: 4 }}>{done}/{total} concluidas</div>
                </div>
                <div style={{ fontSize: 24 }}>→</div>
              </div>
              <div style={{ background: '#F3F4F6', borderRadius: 8, height: 6, marginTop: 8 }}>
                <div style={{ background: '#6C5CE7', borderRadius: 8, height: 6, width: total > 0 ? (done / total * 100) + '%' : '0%' }} />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const q = selectedList.questions[currentQ];
  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setSelectedList(null)} style={{ background: 'rgba(108,92,231,0.1)', border: 'none', borderRadius: 8, color: '#6C5CE7', padding: '8px 14px', cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>
        ← Voltar as listas
      </button>
      <h3 style={{ color: '#2d3436', marginBottom: 4 }}>{selectedList.emoji} {selectedList.title}</h3>
      <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>Questao {currentQ + 1} de {selectedList.questions.length}</p>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16 }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{q.text}</p>

        {q.type === 'choice' && q.options && (
          <div style={{ marginTop: 12 }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => setSelectedOption(i)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 8, borderRadius: 8, cursor: 'pointer', fontSize: 14,
                background: selectedOption === i ? (showAnswer ? (opt === q.answer || q.answer.startsWith(opt.substring(0,2)) ? '#D1FAE5' : '#FEE2E2') : '#EDE9FE') : '#F9FAFB',
                border: selectedOption === i ? '2px solid #6C5CE7' : '1px solid #E5E7EB',
                fontWeight: selectedOption === i ? 600 : 400
              }}>{opt}</button>
            ))}
          </div>
        )}

        {q.type === 'open' && (
          <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Escreva sua resposta aqui..." style={{
            width: '100%', minHeight: 80, border: '2px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, marginTop: 12, resize: 'vertical', boxSizing: 'border-box'
          }} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => { setShowAnswer(!showAnswer); if (!showAnswer) { const key = selectedList.id + '_' + q.id; setCompleted(prev => ({...prev, [key]: true})); }}} style={{
          background: showAnswer ? '#EF4444' : '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 14
        }}>
          {showAnswer ? '🙈 Esconder' : '👀 Ver Resposta'}
        </button>
        <button onClick={() => { if (onAskAI) onAskAI('Me ajude com esta questao de ' + selectedList.title + ': ' + q.text); }} style={{
          background: '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 14
        }}>
          🤖 Pedir Ajuda IA
        </button>
      </div>

      {showAnswer && (
        <div style={{ background: '#D1FAE5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#065F46' }}>✅ Resposta:</div>
          <div style={{ color: '#065F46', whiteSpace: 'pre-wrap' }}>{q.answer}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); }}} disabled={currentQ === 0} style={{
          background: currentQ === 0 ? '#E5E7EB' : '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: currentQ === 0 ? 'default' : 'pointer', fontSize: 14
        }}>
          ← Anterior
        </button>
        <button onClick={() => { if (currentQ < selectedList.questions.length - 1) { setCurrentQ(currentQ + 1); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); }}} disabled={currentQ >= selectedList.questions.length - 1} style={{
          background: currentQ >= selectedList.questions.length - 1 ? '#E5E7EB' : '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: currentQ >= selectedList.questions.length - 1 ? 'default' : 'pointer', fontSize: 14
        }}>
          Proxima →
        </button>
      </div>
    </div>
  );
}

// ============================
// STUDENT VIEW
// ============================

function StudentView({ subject, onBack }) {
  const config = SUBJECTS[subject];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [xp, setXp] = useState(0);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [showExercises, setShowExercises] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      setXp(x => x + 5);
      setPomodoroTime(25 * 60);
      alert('Pausa! Voce ganhou +5 XP! Descanse 5 minutinhos.');
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setXp(x => x + 1);

    try {
      const topicContext = selectedTopic ? ' O tema atual e: ' + selectedTopic.name + ' - ' + selectedTopic.desc + '.' : '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system: config.systemPrompt + topicContext
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || data.error || 'Erro ao processar' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Ops, algo deu errado. Tenta de novo?' }]);
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  };

  const xpLevel = xp < 10 ? 'Curiosa' : xp < 25 ? 'Persistente' : xp < 50 ? 'Guerreira' : 'Mestre dos Estudos';

  if (showExercises && subject === 'math') {
    return (
      <div style={{ minHeight: '100vh', background: config.colors.bg, fontFamily: "'Nunito', sans-serif" }}>
        <Head>
          <title>{config.tutorName} - Exercicios</title>
          <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        </Head>
        <div style={{ background: config.colors.header, padding: '16px 20px', color: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>{config.emoji} {config.tutorName} - Exercicios</h1>
        </div>
        <ExerciseView onBack={() => setShowExercises(false)} onAskAI={(text) => { setShowExercises(false); sendMessage(text); }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: config.colors.bg, fontFamily: "'Nunito', sans-serif" }}>
      <Head>
        <title>{config.tutorName} - EstudaMente</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: config.colors.header, padding: '16px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
              ←
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>{config.emoji} {config.tutorName}</h1>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>Bora estudar!</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13 }}>⭐ {xp} XP - {xpLevel}</div>
            <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 10, height: 8, width: 120, marginTop: 4 }}>
              <div style={{ background: '#FBBF24', borderRadius: 10, height: 8, width: Math.min(xp * 2.4, 120) }} />
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 20px', gap: 10, alignItems: 'center', background: config.colors.primary + '14' }}>
        <span style={{ fontSize: 14 }}>⏱️ {formatTime(pomodoroTime)}</span>
        <button onClick={() => setPomodoroActive(!pomodoroActive)} style={{ background: pomodoroActive ? '#EF4444' : config.colors.primary, color: '#fff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}>
          {pomodoroActive ? 'Pausar' : 'Iniciar Pomodoro'}
        </button>
        {subject === 'math' && (
          <button onClick={() => setShowExercises(true)} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}>
            📚 Exercicios
          </button>
        )}
      </div>

      {/* Topics */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', flexWrap: 'nowrap' }}>
        {config.topics.map(t => (
          <button key={t.id} onClick={() => setSelectedTopic(t)} style={{
            background: selectedTopic?.id === t.id ? config.colors.primary : '#fff',
            color: selectedTopic?.id === t.id ? '#fff' : config.colors.primary,
            border: '2px solid ' + config.colors.primary,
            borderRadius: 20,
            padding: '8px 14px',
            fontSize: 13,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: 600
          }}>
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 20px', flexWrap: 'wrap' }}>
        {config.quickActions.map((a, i) => (
          <button key={i} onClick={() => sendMessage(a.prompt)} style={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer',
            color: config.colors.primary,
            fontWeight: 600
          }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, padding: '12px 20px', minHeight: 300, maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
            <p style={{ fontSize: 40 }}>{config.emoji}</p>
            <p>Escolha um tema acima e me pergunte qualquer coisa!</p>
          </div>
        )}
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} primaryColor={config.colors.primary} />)}
        {loading && <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Pensando... 🤔</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Digite sua duvida..."
          style={{ flex: 1, border: '2px solid #E5E7EB', borderRadius: 24, padding: '10px 16px', fontSize: 15, outline: 'none' }}
        />
        <button onClick={() => sendMessage(input)} style={{ background: config.colors.primary, color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px', fontSize: 15, cursor: 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}

// ============================
// PARENT VIEW
// ============================

function ParentView({ subject, onBack }) {
  const config = SUBJECTS[subject];
  const [tab, setTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [note, setNote] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system: config.parentSystemPrompt
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || data.error || 'Erro ao processar' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Erro de conexao. Tente novamente.' }]);
    }
    setLoading(false);
  };

  const daysUntilTest = () => {
    const test = new Date(config.test.date);
    const now = new Date();
    const diff = Math.ceil((test - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isUrgent = daysUntilTest() <= 1;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <title>EstudaMente - Painel do Responsavel - {config.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)', padding: '16px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>📊 EstudaMente - {config.emoji} {config.name}</h1>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Painel do Responsavel</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        {[['overview', '📋 Visao Geral'], ['content', '📚 Conteudo'], ['consultant', '🤖 Consultor IA']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1,
            padding: '12px',
            background: tab === key ? '#1E3A5F' : 'transparent',
            color: tab === key ? '#fff' : '#6B7280',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {tab === 'overview' && (
          <div>
            <div style={{ background: isUrgent ? '#FEF2F2' : '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: isUrgent ? '2px solid #EF4444' : 'none' }}>
              <h3 style={{ margin: '0 0 12px' }}>{isUrgent ? '🚨' : '📅'} Proxima Prova</h3>
              <p style={{ fontSize: 28, fontWeight: 700, color: isUrgent ? '#EF4444' : '#1E3A5F', margin: 0 }}>{config.test.name}</p>
              <p style={{ color: isUrgent ? '#EF4444' : '#6B7280', margin: '4px 0', fontWeight: isUrgent ? 700 : 400 }}>
                {isUrgent ? '⚡ AMANHA!' : daysUntilTest() + ' dias restantes'}
              </p>
              <p style={{ color: '#6B7280', fontSize: 13 }}>{config.test.details}</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📚 Topicos - {config.name}</h3>
              {config.topics.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 20, marginRight: 12 }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📝 Enviar Recado para o Aluno</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escreva um recado de incentivo..."
                style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => { if (note) { alert('Recado salvo! O aluno vera quando abrir o app.'); setNote(''); }}} style={{ marginTop: 8, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                Enviar Recado
              </button>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📝 Adicionar Novo Conteudo de {config.name}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Cole o texto da materia ou prova abaixo. A IA processara e extraira os topicos automaticamente.</p>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Cole aqui o texto da materia, prova, ou orientacoes do professor..."
                style={{ width: '100%', minHeight: 200, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => { if (newContent) { sendMessage('Analise este conteudo escolar de ' + config.name + ' e extraia: titulo, materia, topicos principais e sugestoes de estudo: ' + newContent); setNewContent(''); setTab('consultant'); }}} style={{ marginTop: 12, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}>
                🤖 Processar com IA
              </button>
            </div>
          </div>
        )}

        {tab === 'consultant' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {config.parentQuickActions.map(([label, prompt], i) => (
                <button key={i} onClick={() => sendMessage(prompt)} style={{
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                  color: '#1E3A5F',
                  fontWeight: 500
                }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, minHeight: 300, maxHeight: 400, overflowY: 'auto', padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
                  <p>Use os botoes acima ou digite sua pergunta</p>
                </div>
              )}
              {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
              {loading && <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Processando... ⏳</div>}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Pergunte ao consultor pedagogico..."
                style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none' }}
              />
              <button onClick={() => sendMessage(input)} style={{ background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// PIN SCREEN
// ============================

const PARENT_PIN = '0608';

function PinScreen({ onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      if (newPin === PARENT_PIN) {
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => { setPin(''); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <Head>
        <title>EstudaMente - Acesso do Responsavel</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>Acesso do Responsavel</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>Digite o PIN de 4 digitos</p>

      {/* PIN dots */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 12,
        animation: shake ? 'shake 0.4s ease-in-out' : 'none'
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
            background: i < pin.length
              ? (error ? '#EF4444' : '#FBBF24')
              : 'transparent',
            transition: 'background 0.15s'
          }} />
        ))}
      </div>

      {error && (
        <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8, height: 20 }}>PIN incorreto. Tente novamente.</p>
      )}
      {!error && <div style={{ height: 20, marginBottom: 8 }} />}

      {/* Numpad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 12, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} onClick={() => handleDigit(String(n))} style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            fontSize: 28,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}>
            {n}
          </button>
        ))}
        <div />
        <button onClick={() => handleDigit('0')} style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          fontSize: 28,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.15s'
        }}>
          0
        </button>
        <button onClick={handleDelete} style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 20,
          cursor: 'pointer'
        }}>
          ⌫
        </button>
      </div>

      <button onClick={onBack} style={{
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        cursor: 'pointer',
        padding: '8px 16px'
      }}>
        ← Voltar
      </button>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}

// ============================
// SUBJECT SELECTOR
// ============================

function SubjectSelector({ role, onSelect, onBack }) {
  const subjectList = Object.values(SUBJECTS);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <Head>
        <title>EstudaMente - Escolha a Materia</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <button onClick={onBack} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: 14 }}>
        ← Voltar
      </button>

      <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 8, textAlign: 'center' }}>📚 Escolha a Materia</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40 }}>
        {role === 'student' ? 'O que vamos estudar hoje?' : 'Qual materia deseja acompanhar?'}
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {subjectList.map(sub => {
          const isUrgent = (() => {
            const test = new Date(sub.test.date);
            const now = new Date();
            return Math.ceil((test - now) / (1000 * 60 * 60 * 24)) <= 1;
          })();

          return (
            <button key={sub.id} onClick={() => onSelect(sub.id)} style={{
              background: sub.colors.header,
              color: '#fff',
              border: isUrgent ? '3px solid #FBBF24' : 'none',
              borderRadius: 20,
              padding: '40px 50px',
              fontSize: 18,
              cursor: 'pointer',
              textAlign: 'center',
              minWidth: 220,
              boxShadow: isUrgent ? '0 10px 30px rgba(251,191,36,0.4)' : '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
              position: 'relative'
            }}>
              {isUrgent && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  background: '#EF4444',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  animation: 'pulse 2s infinite'
                }}>
                  PROVA AMANHA!
                </div>
              )}
              <div style={{ fontSize: 48, marginBottom: 12 }}>{sub.emoji}</div>
              <div style={{ fontWeight: 700 }}>{sub.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{sub.tutorName}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>
                {sub.test.name} - {new Date(sub.test.date).toLocaleDateString('pt-BR')}
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ============================
// MAIN APP
// ============================

export default function Home() {
  const [role, setRole] = useState(null);
  const [subject, setSubject] = useState(null);
  const [showPin, setShowPin] = useState(false);

  // Full app with subject selected
  if (role && subject) {
    const onBack = () => setSubject(null);
    if (role === 'student') return <StudentView subject={subject} onBack={onBack} />;
    if (role === 'parent') return <ParentView subject={subject} onBack={onBack} />;
  }

  // Subject selector (after role is chosen)
  if (role) {
    return <SubjectSelector role={role} onSelect={setSubject} onBack={() => setRole(null)} />;
  }

  // PIN screen for parent
  if (showPin) {
    return <PinScreen onSuccess={() => { setRole('parent'); setShowPin(false); }} onBack={() => setShowPin(false)} />;
  }

  // Role selector
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <Head>
        <title>EstudaMente - Plataforma de Estudos</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 8, textAlign: 'center' }}>🧠 EstudaMente</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 8 }}>Plataforma Multidimensional de Estudos</p>
      <p style={{ color: '#FBBF24', fontSize: 14, marginBottom: 40 }}>📖 Portugues 08/04 | 📜 Historia 09/04 | 🧮 Matematica 10/04</p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setRole('student')} style={{
          background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '40px 50px',
          fontSize: 18,
          cursor: 'pointer',
          textAlign: 'center',
          minWidth: 220,
          boxShadow: '0 10px 30px rgba(108,92,231,0.4)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👩‍🎓</div>
          <div style={{ fontWeight: 700 }}>Sou Aluno(a)</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Estudante</div>
        </button>

        <button onClick={() => setShowPin(true)} style={{
          background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '40px 50px',
          fontSize: 18,
          cursor: 'pointer',
          textAlign: 'center',
          minWidth: 220,
          boxShadow: '0 10px 30px rgba(30,58,95,0.4)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍💼</div>
          <div style={{ fontWeight: 700 }}>Sou Responsavel</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Acompanhamento</div>
        </button>
      </div>
    </div>
  );
}

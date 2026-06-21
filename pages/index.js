import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { BANCO_T2 } from '../lib/bancoT2';

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
    systemPrompt: 'Voce e a MathMente, tutora de matematica do 7o ano: paciente, divertida e ADHD-friendly. Foque EXCLUSIVAMENTE nos 6 topicos do Teste 2 (T2): 1) Operacoes com numeros inteiros; 2) Conceitos iniciais dos numeros racionais; 3) Operacoes com numeros racionais; 4) Propriedades das potencias; 5) Localizacao de raizes na reta numerica; 6) Expressoes algebricas e valor numerico. Se a aluna perguntar de outro assunto, redirecione com carinho para esses topicos. REGRA DE OURO: nunca de a resposta direta de cara — primeiro 1 dica, deixe tentar, depois revele o passo a passo. 1 ideia por vez, frases curtas, use emoji so para marcar etapa (✅ ⚠️ 👉). Conecte com a vida real (dinheiro, elevador, termometro, pizza, jogo). Comemore CADA acerto. USE SEMPRE os hacks e mnemonicos: regra do namoro (sinais: igual da +, diferente da −); hack do elevador (somar/subtrair inteiros, + sobe e − desce); KFC 🍗 (dividir fracao: repete-inverte-multiplica); borboleta 🦋 (somar/comparar fracoes cruzando em X); tabela das potencias (multiplicou mesma base→SOMA expoente, dividiu→SUBTRAI, potencia de potencia→MULTIPLICA, expoente 0→1, expoente 1→ela mesma); "entre quem" 🎯 (raiz nao exata fica entre dois quadrados perfeitos vizinhos); PaPoMuDiSuSo (ordem das contas: Parenteses, Potencias, Multiplicacao/Divisao, Subtracao/Soma); "troca a letra pelo numero" 🔑 (valor numerico). Cuidado com as armadilhas: -2² nao e igual a (-2)²; e 2³+2² NAO soma expoente. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Passos numerados quando precisar. 3) Linguagem simples e acessivel. 4) Sempre encoraje.',
    parentSystemPrompt: 'Voce e um consultor pedagogico de matematica (7o ano) ajudando o responsavel a preparar a aluna para o Teste 2 (T2). Os 6 topicos do T2 sao: Operacoes com numeros inteiros; Conceitos iniciais dos numeros racionais; Operacoes com numeros racionais; Propriedades das potencias; Localizacao de raizes na reta numerica; Expressoes algebricas e valor numerico. Sugira estrategias praticas e atividades para fazer em casa, usando os mnemonicos do app (regra do namoro, hack do elevador, KFC, borboleta, tabela das potencias, "entre quem", PaPoMuDiSuSo, "troca a letra"). Seja pratico e objetivo.',
    topics: [
      { id: 1, name: 'Inteiros', emoji: '➕➖', desc: 'Operacoes com numeros inteiros: soma, subtracao, multiplicacao e divisao (regra do namoro e hack do elevador)' },
      { id: 2, name: 'Racionais (Conceito)', emoji: '🍕', desc: 'Conceitos iniciais dos numeros racionais: fracoes, equivalencia, comparacao (borboleta) e decimais' },
      { id: 3, name: 'Racionais (Operacoes)', emoji: '🦋', desc: 'Operacoes com numeros racionais: somar/subtrair (borboleta), multiplicar e dividir (KFC) fracoes e decimais' },
      { id: 4, name: 'Potencias', emoji: '🧠', desc: 'Propriedades das potencias: somar/subtrair expoentes, potencia de potencia, expoente 0 e 1' },
      { id: 5, name: 'Raizes na Reta', emoji: '🎯', desc: 'Localizacao de raizes na reta numerica e quadrados perfeitos ("entre quais inteiros")' },
      { id: 6, name: 'Expressoes', emoji: '🔑', desc: 'Expressoes algebricas e valor numerico: troca a letra, termos semelhantes e ordem das contas (PaPoMuDiSuSo)' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de forma simples, com exemplos do dia a dia. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de um exemplo pratico e resolvido passo a passo deste tema. Use numeros simples.' },
      { label: '🧠 Hack/Macete', prompt: 'Me ensine o hack ou mnemonico do app para este tema (regra do namoro, elevador, KFC, borboleta, tabela das potencias, "entre quem", PaPoMuDiSuSo ou "troca a letra").' },
      { label: '✏️ Novos Exercicios', prompt: 'Crie 3 NOVOS exercicios de multipla escolha (4 alternativas) que eu ainda NAO vi nesta conversa. Misture este tema com outros topicos de matematica do T2 (inteiros, racionais, potencias, raizes, expressoes) e use alternativas/distratores novos e plausiveis. De 1 dica antes de cada resposta e o gabarito comentado no final.' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema.' }
    ],
    parentQuickActions: [
      ['Estrategias de Estudo', 'Quais as melhores estrategias para estudar os 6 topicos do T2 de matematica (inteiros, racionais, potencias, raizes na reta e expressoes algebricas)?'],
      ['Plano de Revisao', 'Crie um plano de revisao de 3 dias para o T2 de matematica cobrindo inteiros, racionais (conceitos e operacoes), potencias, raizes na reta e expressoes algebricas.'],
      ['Exercicios em Casa', 'Sugira exercicios praticos e rapidos sobre operacoes com numeros racionais (fracoes), usando os hacks da borboleta e do KFC.'],
      ['Como Explicar', 'Como eu, pai/mae, posso explicar a regra dos sinais (regra do namoro) e o hack do elevador para inteiros de um jeito simples em casa?']
    ],
    test: { name: 'T2 Matematica', date: '2026-06-18', details: '6 topicos: Operacoes com inteiros, Racionais (conceitos e operacoes), Propriedades das potencias, Raizes na reta numerica e Expressoes algebricas / valor numerico' }
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
      { label: '✏️ Novos Exercicios', prompt: 'Crie 3 NOVOS exercicios objetivos (4 alternativas a, b, c, d) que eu ainda NAO vi nesta conversa. Misture este tema com outros topicos de portugues do T1 e use alternativas novas e plausiveis. Diga a resposta comentada depois.' },
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
      { label: '✏️ Novos Exercicios', prompt: 'Crie 3 NOVOS exercicios de multipla escolha (4 alternativas) que eu ainda NAO vi nesta conversa. Misture este tema com outros topicos de historia do T1 (do Imperio Romano ao Mundo Medieval) e use alternativas novas e plausiveis. Inclua gabarito comentado no final.' },
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
  },
  sciences: {
    id: 'sciences',
    name: 'Ciencias',
    emoji: '🔬',
    tutorName: 'CienciaMente',
    colors: { primary: '#16A085', secondary: '#27AE60', bg: 'linear-gradient(135deg, #F0FBF7 0%, #EAF7F0 100%)', header: 'linear-gradient(135deg, #16A085, #27AE60)' },
    systemPrompt: 'Voce e a CienciaMente, tutora de Ciencias da Natureza do 7o ano: paciente, divertida e ADHD-friendly. Foque EXCLUSIVAMENTE no projeto "O Equilibrio Termico e o Efeito Estufa Natural", que cobre: 1) Termodinamica basica (calor x temperatura; calor especifico; trabalho = forca x deslocamento); 2) Transferencia de calor (CONDUCAO por contato; CONVECCAO em fluidos/correntes; IRRADIACAO por ondas, sem meio); 3) Maquinas termicas (motor a vapor e combustao, Revolucao Industrial, energia termica vira movimento); 4) Efeito estufa NATURAL (mantem a vida; sem ele a Terra ficaria abaixo de 0C) e gases (CO2, CH4, H2O, CO, CFCs); 5) Dinamicas atmosfericas (ventos por diferenca de pressao; brisa maritima de dia e terrestre a noite; massas de ar e frentes fria/quente; rios voadores da Amazonia); 6) Hidrosfera (correntes maritimas transportam calor; densidade e salinidade; continentes de plastico); 7) Impactos (aquecimento global, inversao termica, chuva acida, camada de ozonio e Protocolo de Montreal); 8) Solucoes (energias renovaveis eolica/solar/biogas, consumo consciente, reciclagem). Se a aluna perguntar de outro assunto, redirecione com carinho dizendo que o foco e o equilibrio termico terrestre e a climatologia. REGRA DE OURO: nunca de a resposta direta de cara em quiz - primeiro 1 dica, deixe tentar, depois revele. USE ANALOGIAS DO DIA A DIA: carro fechado ao sol = efeito estufa; geladeira e panela = conveccao; sentir o Sol/fogueira = irradiacao; cabo de panela de plastico = isolante (conducao); agua tem alto calor especifico (demora a esquentar e a esfriar, por isso a brisa muda do dia para a noite). FIDELIDADE: nao invente estatisticas; use os dados reais (ex: Verkhoyansk varia de -67,8C a 37,3C; furacao acima de 118 km/h; Antartida perdeu ~3 trilhoes de toneladas de gelo entre 1992-2017; no Brasil menos de 5% dos residuos sao reciclados). REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) 1 ideia por vez, frases curtas. 3) Passos numerados quando precisar. 4) Emoji so para marcar etapa (✅ ⚠️ 👉). 5) Conecte com a vida real. 6) Comemore CADA acerto e sempre encoraje.',
    parentSystemPrompt: 'Voce e um consultor pedagogico de Ciencias da Natureza (7o ano) ajudando o responsavel no projeto "O Equilibrio Termico e o Efeito Estufa Natural". Os eixos sao: termodinamica basica (calor x temperatura, calor especifico, trabalho), transferencia de calor (conducao, conveccao, irradiacao), maquinas termicas e Revolucao Industrial, efeito estufa natural e gases (CO2, CH4, H2O, CO, CFCs), dinamicas atmosfericas (ventos, brisas, massas de ar, frentes, rios voadores), hidrosfera e correntes maritimas, impactos antropogenicos (aquecimento global, inversao termica, chuva acida, camada de ozonio e Protocolo de Montreal) e solucoes sustentaveis (energias renovaveis, consumo consciente, reciclagem). Sugira estrategias praticas e atividades para casa, conectando a fisica com fenomenos do cotidiano (conveccao e a brisa do mar; o carro fechado ao sol e o efeito estufa). Foque na alfabetizacao cientifica e na leitura de graficos e mapas. Seja pratico e objetivo.',
    topics: [
      { id: 1, name: 'Calor e Temperatura', emoji: '🌡️', desc: 'Termodinamica basica: diferenca entre calor e temperatura, calor especifico e trabalho (forca x deslocamento)' },
      { id: 2, name: 'Transferencia de Calor', emoji: '🔥', desc: 'Conducao (contato), conveccao (fluidos e correntes) e irradiacao (ondas, sem meio) - geladeira, panela e o Sol' },
      { id: 3, name: 'Maquinas Termicas', emoji: '⚙️', desc: 'Motores a vapor e combustao, transformacao de energia termica em movimento e a Revolucao Industrial' },
      { id: 4, name: 'Efeito Estufa', emoji: '🌍', desc: 'Efeito estufa natural mantem a vida; gases (CO2, CH4, H2O, CO, CFCs) e a relacao com o aquecimento global' },
      { id: 5, name: 'Ventos e Massas de Ar', emoji: '🌬️', desc: 'Ventos por diferenca de pressao, brisa maritima e terrestre, massas de ar, frentes fria/quente e rios voadores' },
      { id: 6, name: 'Oceanos e Correntes', emoji: '🌊', desc: 'Correntes maritimas transportam calor; densidade, salinidade e o problema dos continentes de plastico' },
      { id: 7, name: 'Ozonio e Poluicao', emoji: '☁️', desc: 'Camada de ozonio e Protocolo de Montreal, inversao termica, chuva acida e poluicao do ar' },
      { id: 8, name: 'Sustentabilidade', emoji: '♻️', desc: 'Energias renovaveis (eolica, solar, biogas), consumo consciente, reciclagem e tecnologias de baixa emissao' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de ciencias de forma simples, com exemplos do dia a dia. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de um exemplo pratico do cotidiano que mostre este fenomeno (tipo geladeira, brisa do mar, carro no sol). Explique o porque.' },
      { label: '🧠 Analogia', prompt: 'Me de uma analogia ou macete do dia a dia para nunca mais esquecer este conceito de ciencias.' },
      { label: '✏️ Novos Exercicios', prompt: 'Crie 3 NOVOS exercicios de multipla escolha (4 alternativas) que eu ainda NAO vi nesta conversa. Misture este tema com outros topicos do projeto (termodinamica, atmosfera, oceanos, efeito estufa, sustentabilidade) e use alternativas/distratores novos e plausiveis. De 1 dica antes da resposta e o gabarito comentado no final.' },
      { label: '🗂️ Mapa Mental', prompt: 'Monte um mapa mental curto deste tema, ligando causa e efeito (ex: o que causa o que no clima).' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) com os Conceitos-Chave mais importantes deste tema.' }
    ],
    parentQuickActions: [
      ['Estrategias de Estudo', 'Quais as melhores estrategias para estudar o projeto do equilibrio termico e efeito estufa (termodinamica, atmosfera, oceanos e sustentabilidade)?'],
      ['Plano de Revisao', 'Crie um plano de revisao de 3 dias para o projeto de ciencias, cobrindo transferencia de calor, efeito estufa, massas de ar e impactos ambientais.'],
      ['Atividade em Casa', 'Sugira uma atividade pratica e simples para fazer em casa que demonstre conveccao ou o efeito estufa (com materiais do dia a dia).'],
      ['Interdisciplinar', 'Como conectar a fisica (conveccao, calor especifico) com os fenomenos climaticos (brisas, ventos, correntes) de um jeito que a aluna entenda?']
    ],
    test: { name: 'Projeto Ciencias', date: '2026-07-10', details: 'Projeto "O Equilibrio Termico e o Efeito Estufa Natural" | Termodinamica, dinamicas atmosfericas, hidrosfera, efeito estufa e sustentabilidade' }
  }
};

// ============================
// CONTEXTUAL SUGGESTIONS
// ============================

function getContextualSuggestions(lastAssistantMessage, selectedTopic, messageCount) {
  const suggestions = [];

  // Always offer to go deeper
  suggestions.push({ label: '🔍 Aprofundar', prompt: 'Aprofunde mais esse ultimo ponto. Explique com mais detalhes e exemplos.' });

  // If topic is selected, offer topic-specific actions
  if (selectedTopic) {
    suggestions.push({ label: '✏️ Exercicios sobre isso', prompt: 'Crie 3 NOVOS exercicios de multipla escolha (4 alternativas) sobre o que voce acabou de explicar, misturando com outros temas da materia e usando alternativas novas. Nao repita exercicios anteriores.' });
    suggestions.push({ label: '🧠 Macete', prompt: 'Me de um macete ou dica para memorizar o que voce acabou de explicar.' });
  }

  // Context-aware based on message content
  if (lastAssistantMessage) {
    const msg = lastAssistantMessage.toLowerCase();
    if (msg.includes('exemplo') || msg.includes('passo')) {
      suggestions.push({ label: '📝 Outro exemplo', prompt: 'Me de mais um exemplo diferente sobre esse mesmo assunto.' });
    }
    if (msg.includes('quiz') || msg.includes('exercicio') || msg.includes('alternativa') || msg.includes('resposta')) {
      suggestions.push({ label: '🎯 Mais exercicios', prompt: 'Crie mais 3 NOVOS exercicios diferentes dos anteriores, misturando temas da materia e usando alternativas novas. Aumente um pouco a dificuldade.' });
      suggestions.push({ label: '✅ Corrigir', prompt: 'Me explique a resposta correta de cada questao e por que as outras alternativas estao erradas.' });
    }
    if (msg.includes('resumo') || msg.includes('pontos')) {
      suggestions.push({ label: '🗂️ Mapa mental', prompt: 'Transforme esse resumo em um mapa mental com topicos e subtopicos organizados.' });
    }
    if (msg.includes('erro') || msg.includes('errado') || msg.includes('cuidado')) {
      suggestions.push({ label: '💪 Praticar', prompt: 'Crie exercicios focados exatamente nesses erros comuns para eu praticar.' });
    }
  }

  // Progressive flow suggestions
  if (messageCount >= 4) {
    suggestions.push({ label: '📋 Resumo geral', prompt: 'Faca um resumo de tudo que estudamos ate agora nessa conversa. Destaque os pontos-chave.' });
  }

  // Always available
  suggestions.push({ label: '🐢 Simplificar', prompt: 'Explique isso de um jeito mais simples. Nao entendi bem a ultima explicacao.' });
  suggestions.push({ label: '➡️ Proximo topico', prompt: 'Ja entendi esse assunto. Me fale sobre o proximo topico importante que devo estudar para a prova.' });

  // Limit to 4 suggestions to keep UI clean
  return suggestions.slice(0, 4);
}

// ============================
// EXERCISE LISTS (T2 - geradas a partir do banco de questoes)
// ============================

const T2_LIST_DEFS = [
  { id: 'inteiros', cat: 'Operações com Inteiros', title: 'Lista 1 - Operacoes com Inteiros', desc: 'Soma, subtracao, multiplicacao e divisao (regra do namoro e hack do elevador)', emoji: '➕➖' },
  { id: 'rac-conceitos', cat: 'Racionais (Conceitos)', title: 'Lista 2 - Racionais: Conceitos', desc: 'Fracoes, equivalencia, comparacao (borboleta) e decimais', emoji: '🍕' },
  { id: 'rac-operacoes', cat: 'Racionais (Operações)', title: 'Lista 3 - Racionais: Operacoes', desc: 'Somar/subtrair (borboleta), multiplicar e dividir (KFC) fracoes e decimais', emoji: '🦋' },
  { id: 'potencias', cat: 'Potências', title: 'Lista 4 - Potencias', desc: 'Propriedades das potencias e armadilhas', emoji: '🧠' },
  { id: 'raizes', cat: 'Raízes e Reta Numérica', title: 'Lista 5 - Raizes e Reta Numerica', desc: 'Raiz quadrada e "entre quais inteiros"', emoji: '🎯' },
  { id: 'expressoes', cat: 'Expressões Algébricas', title: 'Lista 6 - Expressoes Algebricas', desc: 'Valor numerico (troca a letra), termos semelhantes e ordem das contas', emoji: '🔑' }
];

const EXERCISE_LISTS = T2_LIST_DEFS.map(def => ({
  id: def.id,
  title: def.title,
  desc: def.desc,
  emoji: def.emoji,
  questions: BANCO_T2
    .filter(q => q.categoria === def.cat)
    .map((q, i) => ({
      id: i + 1,
      text: q.pergunta,
      type: q.tipo === 'multipla' ? 'choice' : 'open',
      options: q.opcoes || null,
      answer: q.resposta,
      explanation: q.explicacao,
      dica: q.dica,
      dificuldade: q.dificuldade
    }))
}));

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
  const [showDica, setShowDica] = useState(false);
  const [completed, setCompleted] = useState({});

  if (!selectedList) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack} style={{ background: 'rgba(108,92,231,0.1)', border: 'none', borderRadius: 8, color: '#6C5CE7', padding: '8px 14px', cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>
          ← Voltar
        </button>
        <h2 style={{ color: '#2d3436', marginBottom: 4 }}>📚 Listas de Exercicios</h2>
        <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>Pratique para o T2 de Matematica ({BANCO_T2.length} questoes)</p>
        {EXERCISE_LISTS.map(list => {
          const done = Object.keys(completed).filter(k => k.startsWith(list.id + '_')).length;
          const total = list.questions.length;
          return (
            <button key={list.id} onClick={() => { setSelectedList(list); setCurrentQ(0); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); setShowDica(false); }} style={{
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
                background: showAnswer && opt === q.answer ? '#D1FAE5' : (selectedOption === i ? (showAnswer ? '#FEE2E2' : '#EDE9FE') : '#F9FAFB'),
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
        {q.dica && (
          <button onClick={() => setShowDica(!showDica)} style={{
            background: showDica ? '#F59E0B' : '#FBBF24', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 14
          }}>
            {showDica ? '🙈 Esconder Dica' : '💡 Dica'}
          </button>
        )}
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

      {showDica && q.dica && (
        <div style={{ background: '#FEF3C7', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #FCD34D' }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#92400E' }}>💡 Dica:</div>
          <div style={{ color: '#78350F', whiteSpace: 'pre-wrap' }}>{q.dica}</div>
        </div>
      )}

      {showAnswer && (
        <div style={{ background: '#D1FAE5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#065F46' }}>✅ Resposta:</div>
          <div style={{ color: '#065F46', whiteSpace: 'pre-wrap', fontWeight: 600 }}>{q.answer}</div>
          {q.explanation && (
            <div style={{ color: '#047857', whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 14 }}>👉 {q.explanation}</div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); setShowDica(false); }}} disabled={currentQ === 0} style={{
          background: currentQ === 0 ? '#E5E7EB' : '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: currentQ === 0 ? 'default' : 'pointer', fontSize: 14
        }}>
          ← Anterior
        </button>
        <button onClick={() => { if (currentQ < selectedList.questions.length - 1) { setCurrentQ(currentQ + 1); setShowAnswer(false); setUserAnswer(''); setSelectedOption(null); setShowDica(false); }}} disabled={currentQ >= selectedList.questions.length - 1} style={{
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

function StudentView({ subject, onBack, studentName }) {
  const config = SUBJECTS[subject];
  const nameContext = studentName ? ' O(a) aluno(a) se chama ' + studentName + '.' : '';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [xp, setXp] = useState(() => getXp());
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [showExercises, setShowExercises] = useState(false);
  const [parentNotes, setParentNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const chatEndRef = useRef(null);

  // Load parent messages on mount
  useEffect(() => {
    const msgs = getMessages().filter(m => m.from === 'parent');
    setParentNotes(msgs);
    if (msgs.some(m => !m.read)) setShowNotes(true);
    markMessagesRead();
  }, []);

  // Save XP when it changes
  useEffect(() => { saveXp(xp); }, [xp]);

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
          system: config.systemPrompt + nameContext + topicContext
        })
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.content) {
        console.error('Erro no chat:', data.error || ('HTTP ' + res.status));
        setMessages([...newMessages, { role: 'assistant', content: 'Opa, tive um probleminha para responder agora 😅. Tenta de novo daqui a pouquinho? Se continuar, avisa o responsavel.' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
      }
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
              <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>{studentName ? 'Oi, ' + studentName + '!' : 'Bora estudar!'}</p>
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

      {/* Parent Notes Banner */}
      {showNotes && parentNotes.length > 0 && (
        <div style={{ margin: '0 20px', background: '#FEF3C7', borderRadius: 12, padding: 16, border: '1px solid #FCD34D' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: '#92400E' }}>💌 Recados do Responsavel</h4>
            <button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#92400E' }}>✕</button>
          </div>
          {parentNotes.slice(-3).map((n, i) => (
            <div key={i} style={{ background: '#FFFBEB', borderRadius: 8, padding: '8px 12px', marginBottom: 4, fontSize: 14, color: '#78350F' }}>
              {n.text}
              <div style={{ fontSize: 10, color: '#B45309', marginTop: 4 }}>{new Date(n.time).toLocaleString('pt-BR')}</div>
            </div>
          ))}
        </div>
      )}

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
        {!loading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 0', marginBottom: 8 }}>
            {getContextualSuggestions(
              messages[messages.length - 1].content,
              selectedTopic,
              messages.length
            ).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                background: config.colors.primary + '12',
                border: '1px solid ' + config.colors.primary + '40',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                color: config.colors.primary,
                fontWeight: 600,
                transition: 'background 0.15s'
              }}>
                {s.label}
              </button>
            ))}
          </div>
        )}
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
  const [checkedTopics, setCheckedTopics] = useState(() => getChecklist(subject));
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [generatingCards, setGeneratingCards] = useState(false);
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
      if (!res.ok || data.error || !data.content) {
        setMessages([...newMessages, { role: 'assistant', content: 'Nao foi possivel gerar a resposta agora. Detalhe tecnico: ' + (data.error || ('HTTP ' + res.status)) + '. Verifique a chave ANTHROPIC_API_KEY (e o saldo/limite da conta Anthropic) nas variaveis de ambiente do Vercel.' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Erro de conexao. Tente novamente.' }]);
    }
    setLoading(false);
  };

  const generateFlashcards = async () => {
    setGeneratingCards(true);
    try {
      const topicNames = config.topics.map(t => t.name + ' (' + t.desc + ')').join(', ');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Gere exatamente 8 flashcards para revisao sobre: ' + topicNames + '. Responda APENAS no formato JSON array, sem texto extra: [{"q":"pergunta curta","a":"resposta curta"}]. Cada pergunta deve ter no maximo 15 palavras e cada resposta no maximo 20 palavras.' }],
          system: 'Voce gera flashcards educacionais. Responda APENAS com JSON valido, sem markdown, sem texto antes ou depois.'
        })
      });
      const data = await res.json();
      try {
        const jsonStr = data.content.replace(/```json?/g, '').replace(/```/g, '').trim();
        const cards = JSON.parse(jsonStr);
        if (Array.isArray(cards)) setFlashcards(cards);
      } catch (e) {
        setFlashcards([{ q: 'Erro ao gerar cards', a: 'Tente novamente' }]);
      }
    } catch (err) {
      setFlashcards([{ q: 'Erro de conexao', a: 'Tente novamente' }]);
    }
    setGeneratingCards(false);
  };

  const daysUntilTest = () => {
    const test = new Date(config.test.date);
    const now = new Date();
    const diff = Math.ceil((test - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isUrgent = daysUntilTest() <= 1;
  const checkedCount = Object.values(checkedTopics).filter(Boolean).length;
  const totalTopics = config.topics.length;
  const progressPercent = Math.round((checkedCount / totalTopics) * 100);

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
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>📊 EstudaMente - {config.emoji} {config.name}</h1>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Painel do Responsavel</p>
          </div>
          {checkedCount > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12 }}>{checkedCount}/{totalTopics} topicos</div>
              <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 10, height: 6, width: 80, marginTop: 2 }}>
                <div style={{ background: '#10B981', borderRadius: 10, height: 6, width: (progressPercent / 100) * 80 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs - scrollable */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E5E7EB', overflowX: 'auto' }}>
        {[['overview', '📋 Geral'], ['checklist', '✅ Revisao'], ['flashcards', '🃏 Flashcards'], ['simulator', '📝 Simulado'], ['consultant', '🤖 IA']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 'none',
            padding: '12px 16px',
            background: tab === key ? '#1E3A5F' : 'transparent',
            color: tab === key ? '#fff' : '#6B7280',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>

        {/* ===== OVERVIEW TAB ===== */}
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

            {/* Progress bar */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📊 Progresso da Revisao</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: 10, height: 16 }}>
                  <div style={{ background: progressPercent === 100 ? '#10B981' : '#3B82F6', borderRadius: 10, height: 16, width: progressPercent + '%', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 18, color: progressPercent === 100 ? '#10B981' : '#1E3A5F' }}>{progressPercent}%</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: 13, margin: '8px 0 0' }}>
                {checkedCount === 0 ? 'Marque os topicos revisados na aba ✅ Revisao' : checkedCount === totalTopics ? '🎉 Todos os topicos revisados! Pronto para a prova!' : checkedCount + ' de ' + totalTopics + ' topicos revisados'}
              </p>
            </div>

            {/* Quick actions grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <button onClick={() => setTab('flashcards')} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🃏</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1E3A5F' }}>Flashcards</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Revisao rapida juntos</div>
              </button>
              <button onClick={() => setTab('simulator')} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>📝</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1E3A5F' }}>Simulado</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Prova simulada completa</div>
              </button>
              <button onClick={() => setTab('checklist')} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1E3A5F' }}>Checklist</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Marcar topicos revisados</div>
              </button>
              <button onClick={() => setTab('consultant')} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🤖</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1E3A5F' }}>Consultor IA</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Estrategias de estudo</div>
              </button>
            </div>

            {/* Send note */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📝 Enviar Recado para o Aluno</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escreva um recado de incentivo..."
                style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => { if (note) { addMessage('parent', note); alert('Recado enviado! ' + (loadFamily()?.studentName || 'O aluno') + ' vera quando abrir o app.'); setNote(''); }}} style={{ marginTop: 8, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                Enviar Recado
              </button>
            </div>
          </div>
        )}

        {/* ===== CHECKLIST TAB ===== */}
        {tab === 'checklist' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>✅ Checklist de Revisao</h3>
                <span style={{ fontSize: 14, fontWeight: 700, color: progressPercent === 100 ? '#10B981' : '#1E3A5F' }}>{progressPercent}%</span>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Marque cada topico apos revisar com o aluno. Clique no topico para receber dicas de como explica-lo.</p>

              {config.topics.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6', gap: 12 }}>
                  <button onClick={() => setCheckedTopics(prev => { const next = { ...prev, [t.id]: !prev[t.id] }; saveChecklist(subject, next); return next; })} style={{
                    width: 28, height: 28, borderRadius: 8, border: '2px solid ' + (checkedTopics[t.id] ? '#10B981' : '#D1D5DB'),
                    background: checkedTopics[t.id] ? '#10B981' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 14
                  }}>
                    {checkedTopics[t.id] ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1, opacity: checkedTopics[t.id] ? 0.5 : 1, textDecoration: checkedTopics[t.id] ? 'line-through' : 'none' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.emoji} {t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.desc}</div>
                  </div>
                  <button onClick={() => { sendMessage('Me de dicas praticas de como eu, como pai/mae, posso explicar o topico "' + t.name + ' - ' + t.desc + '" para meu filho de forma simples e engajante em casa. Inclua: 1) Como introduzir o assunto 2) Atividade pratica para fazer juntos 3) Perguntas para verificar se entendeu.'); setTab('consultant'); }} style={{
                    background: '#EFF6FF', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11, cursor: 'pointer', color: '#3B82F6', fontWeight: 600, flexShrink: 0
                  }}>
                    💡 Dicas
                  </button>
                </div>
              ))}
            </div>

            {checkedCount > 0 && checkedCount < totalTopics && (
              <div style={{ background: '#FFFBEB', borderRadius: 12, padding: 16, border: '1px solid #FCD34D', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#92400E' }}>
                  💪 <strong>Faltam {totalTopics - checkedCount} topicos!</strong> Foque nos nao marcados. Clique em "💡 Dicas" ao lado de cada um para saber como abordar.
                </p>
              </div>
            )}
            {checkedCount === totalTopics && (
              <div style={{ background: '#ECFDF5', borderRadius: 12, padding: 16, border: '1px solid #6EE7B7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#065F46' }}>
                  🎉 <strong>Todos os topicos revisados!</strong> Que tal fazer um simulado na aba 📝 Simulado para testar o conhecimento?
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== FLASHCARDS TAB ===== */}
        {tab === 'flashcards' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 8px' }}>🃏 Flashcards de Revisao</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>Revise os topicos juntos! Clique no cartao para ver a resposta.</p>
              <button onClick={generateFlashcards} disabled={generatingCards} style={{
                background: generatingCards ? '#9CA3AF' : '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: generatingCards ? 'wait' : 'pointer', fontSize: 14
              }}>
                {generatingCards ? '⏳ Gerando flashcards...' : flashcards.length > 0 ? '🔄 Gerar novos flashcards' : '✨ Gerar flashcards com IA'}
              </button>
            </div>

            {flashcards.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {flashcards.map((card, i) => (
                  <button key={i} onClick={() => setFlippedCards(prev => ({ ...prev, [i]: !prev[i] }))} style={{
                    background: flippedCards[i] ? '#ECFDF5' : '#fff',
                    borderRadius: 12,
                    padding: 16,
                    border: flippedCards[i] ? '2px solid #10B981' : '1px solid #E5E7EB',
                    cursor: 'pointer',
                    textAlign: 'center',
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
                      {flippedCards[i] ? '✅ Resposta' : '❓ Pergunta ' + (i + 1)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: flippedCards[i] ? '#065F46' : '#1E3A5F', lineHeight: 1.4 }}>
                      {flippedCards[i] ? card.a : card.q}
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 8 }}>
                      {flippedCards[i] ? 'Clique para ver pergunta' : 'Clique para ver resposta'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {flashcards.length > 0 && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button onClick={() => setFlippedCards({})} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: '#3B82F6', fontWeight: 600 }}>
                  🔄 Esconder todas as respostas
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== SIMULATOR TAB ===== */}
        {tab === 'simulator' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 8px' }}>📝 Simulado da Prova</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>Gere uma prova simulada no formato real para aplicar em casa. A IA cria questoes diferentes a cada vez.</p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => sendMessage('Gere um SIMULADO COMPLETO de ' + config.name + ' no formato da prova real. Topicos: ' + config.topics.map(t => t.name).join(', ') + '. Inclua: questoes objetivas com 4 alternativas E questoes dissertativas. Formate bem para o pai poder aplicar em casa. No final, coloque o GABARITO separado.')} style={{
                  background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600
                }}>
                  📋 Simulado Completo
                </button>
                <button onClick={() => sendMessage('Gere um SIMULADO RAPIDO (5 questoes) de ' + config.name + ' focando nos topicos mais importantes: ' + config.topics.map(t => t.name).join(', ') + '. Mix de objetivas e abertas. Formate para aplicar em casa. Gabarito no final.')} style={{
                  background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600
                }}>
                  ⚡ Simulado Rapido (5 questoes)
                </button>
                <button onClick={() => {
                  const unchecked = config.topics.filter(t => !checkedTopics[t.id]).map(t => t.name);
                  if (unchecked.length === 0) {
                    sendMessage('Gere um simulado de revisao geral de ' + config.name + ' cobrindo todos os topicos: ' + config.topics.map(t => t.name).join(', ') + '. Gabarito no final.');
                  } else {
                    sendMessage('Gere um simulado FOCADO nos topicos que ainda nao revisamos: ' + unchecked.join(', ') + '. Esses sao os pontos fracos. Crie questoes objetivas e dissertativas. Gabarito no final.');
                  }
                }} style={{
                  background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600
                }}>
                  🎯 Foco nos Pontos Fracos
                </button>
              </div>
            </div>

            {/* Simulator chat */}
            <div style={{ background: '#fff', borderRadius: 12, minHeight: 300, maxHeight: 500, overflowY: 'auto', padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
                  <p style={{ fontSize: 32 }}>📝</p>
                  <p>Clique em um dos botoes acima para gerar o simulado</p>
                </div>
              )}
              {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
              {loading && <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Gerando simulado... ⏳</div>}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* ===== CONSULTANT TAB ===== */}
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
      const family = loadFamily();
      if (family && newPin === family.pin) {
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

function SubjectSelector({ role, onSelect, onBack, studentName }) {
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
        {role === 'student' ? (studentName ? 'O que vamos estudar hoje, ' + studentName + '?' : 'O que vamos estudar hoje?') : 'Qual materia deseja acompanhar?'}
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
// PERSISTENCE HELPERS
// ============================

const STORAGE_KEY = 'estudamente_family';

function loadFamily() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function saveFamily(family) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(family));
}

function getMessages() {
  const family = loadFamily();
  return family?.messages || [];
}

function addMessage(from, text) {
  const family = loadFamily();
  if (!family) return;
  if (!family.messages) family.messages = [];
  family.messages.push({ from, text, time: Date.now(), read: false });
  saveFamily(family);
}

function markMessagesRead() {
  const family = loadFamily();
  if (!family?.messages) return;
  family.messages = family.messages.map(m => ({ ...m, read: true }));
  saveFamily(family);
}

function getChecklist(subject) {
  const family = loadFamily();
  return family?.checklist?.[subject] || {};
}

function saveChecklist(subject, checked) {
  const family = loadFamily();
  if (!family) return;
  if (!family.checklist) family.checklist = {};
  family.checklist[subject] = checked;
  saveFamily(family);
}

function getXp() {
  const family = loadFamily();
  return family?.xp || 0;
}

function saveXp(xp) {
  const family = loadFamily();
  if (!family) return;
  family.xp = xp;
  saveFamily(family);
}

// ============================
// SETUP SCREEN (first time)
// ============================

function SetupScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');

  const handleFinish = () => {
    if (pin.length !== 4) { setPinError('PIN deve ter 4 digitos'); return; }
    if (pin !== pinConfirm) { setPinError('PINs nao conferem'); return; }
    const family = { studentName: studentName.trim(), pin, messages: [], checklist: {}, xp: 0, createdAt: Date.now() };
    saveFamily(family);
    onComplete(family);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: 20
    }}>
      <Head>
        <title>EstudaMente - Configuracao</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 4 }}>🧠 EstudaMente</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>Configuracao inicial da familia</p>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[1, 2].map(s => (
          <div key={s} style={{ width: 40, height: 6, borderRadius: 3, background: s <= step ? '#FBBF24' : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👩‍🎓</div>
          <h2 style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>Qual o nome do(a) aluno(a)?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>Esse nome sera usado para personalizar a experiencia</p>
          <input
            value={studentName} onChange={(e) => setStudentName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && studentName.trim() && setStep(2)}
            placeholder="Nome do aluno(a)..." autoFocus
            style={{ width: 280, padding: '14px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 18, textAlign: 'center', outline: 'none', marginBottom: 20 }}
          />
          <button onClick={() => studentName.trim() && setStep(2)} style={{
            background: studentName.trim() ? 'linear-gradient(135deg, #6C5CE7, #A855F7)' : 'rgba(255,255,255,0.1)',
            color: '#fff', border: 'none', borderRadius: 12, padding: '12px 40px', fontSize: 16, fontWeight: 600,
            cursor: studentName.trim() ? 'pointer' : 'not-allowed', opacity: studentName.trim() ? 1 : 0.5
          }}>
            Proximo →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>Crie um PIN do responsavel</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>PIN de 4 digitos para acessar o painel do responsavel</p>
          <input
            value={pin} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setPin(v); setPinError(''); }}
            placeholder="PIN (4 digitos)" type="password" inputMode="numeric"
            style={{ width: 200, padding: '14px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 24, textAlign: 'center', outline: 'none', marginBottom: 12, letterSpacing: 8 }}
          />
          <input
            value={pinConfirm} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setPinConfirm(v); setPinError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
            placeholder="Confirme o PIN" type="password" inputMode="numeric"
            style={{ width: 200, padding: '14px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 24, textAlign: 'center', outline: 'none', marginBottom: 8, letterSpacing: 8 }}
          />
          {pinError && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{pinError}</p>}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, cursor: 'pointer' }}>
              ← Voltar
            </button>
            <button onClick={handleFinish} style={{
              background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}>
              ✅ Criar Familia
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================
// MAIN APP
// ============================

export default function Home() {
  const [family, setFamily] = useState(undefined); // undefined = loading, null = no family
  const [role, setRole] = useState(null);
  const [subject, setSubject] = useState(null);
  const [showPin, setShowPin] = useState(false);

  // Load family on mount
  useEffect(() => {
    setFamily(loadFamily());
  }, []);

  // Loading state
  if (family === undefined) return null;

  // First time setup
  if (!family) {
    return <SetupScreen onComplete={(f) => setFamily(f)} />;
  }

  const studentName = family.studentName;
  const unreadMessages = (family.messages || []).filter(m => !m.read && m.from === 'parent').length;

  // Full app with subject selected
  if (role && subject) {
    const onBack = () => setSubject(null);
    if (role === 'student') return <StudentView subject={subject} onBack={onBack} studentName={studentName} />;
    if (role === 'parent') return <ParentView subject={subject} onBack={onBack} />;
  }

  // Subject selector (after role is chosen)
  if (role) {
    return <SubjectSelector role={role} onSelect={setSubject} onBack={() => setRole(null)} studentName={studentName} />;
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
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: 20
    }}>
      <Head>
        <title>EstudaMente - Plataforma de Estudos</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 8, textAlign: 'center' }}>🧠 EstudaMente</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 4 }}>Plataforma Multidimensional de Estudos</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8 }}>Ola, familia de <strong style={{ color: '#FBBF24' }}>{studentName}</strong>!</p>
      <p style={{ color: '#FBBF24', fontSize: 14, marginBottom: 40 }}>📖 Portugues 08/04 | 📜 Historia 09/04 | 🧮 Matematica T2 18/06 | 🔬 Ciencias 10/07</p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setRole('student')} style={{
          background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: '#fff', border: 'none', borderRadius: 20,
          padding: '40px 50px', fontSize: 18, cursor: 'pointer', textAlign: 'center', minWidth: 220,
          boxShadow: '0 10px 30px rgba(108,92,231,0.4)', transition: 'transform 0.2s', position: 'relative'
        }}>
          {unreadMessages > 0 && (
            <div style={{ position: 'absolute', top: -8, right: -8, background: '#EF4444', color: '#fff', borderRadius: 20, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
              {unreadMessages}
            </div>
          )}
          <div style={{ fontSize: 48, marginBottom: 12 }}>👩‍🎓</div>
          <div style={{ fontWeight: 700 }}>Sou {studentName}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Estudante</div>
        </button>

        <button onClick={() => setShowPin(true)} style={{
          background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)', color: '#fff', border: 'none', borderRadius: 20,
          padding: '40px 50px', fontSize: 18, cursor: 'pointer', textAlign: 'center', minWidth: 220,
          boxShadow: '0 10px 30px rgba(30,58,95,0.4)', transition: 'transform 0.2s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍💼</div>
          <div style={{ fontWeight: 700 }}>Sou Responsavel</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Acompanhamento</div>
        </button>
      </div>

      <button onClick={() => { if (confirm('Isso apagara todos os dados desta familia. Deseja continuar?')) { localStorage.removeItem(STORAGE_KEY); setFamily(null); }}} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', marginTop: 40, padding: '8px 16px'
      }}>
        Trocar familia / Reconfigurar
      </button>
    </div>
  );
}

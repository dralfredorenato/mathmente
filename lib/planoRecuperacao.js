// ============================
// PLANO DE RECUPERACAO T2 - Ana Clara
// 7 dias, 30 exercicios/dia em 2 sessoes (manha + noite)
// LINGUAGEM ADAPTADA: vocabulario simples, frases curtas (1 ideia por linha),
// tudo concreto. Pensado para o PAI LER JUNTO em voz alta.
// Cada dia tem "papoFalado": pai pergunta, ela responde falando (treina a Q6).
// ============================

export const PLANO_RECUPERACAO = {
  titulo: 'Missao Matematica - 7 dias',
  subtitulo: 'Um assunto por dia. De manha e de noite. Voce consegue!',
  exerciciosPorDia: 30,
  comoUsar: 'Leiam juntos, em voz alta. O pai le o cartao, a Ana Clara responde falando.',
  dias: [
    {
      dia: 1, quando: 'Terca', emoji: '➕➖', tema: 'Sinais (mais e menos)',
      cor: '#6C5CE7',
      regras: [
        { tipo: 'ok', selo: 'A regra dos sinais', linhas: ['Sinais IGUAIS → da MAIS', 'Sinais DIFERENTES → da MENOS'], legenda: 'Mais com mais = mais. Menos com menos = mais. Mais com menos = menos.' },
        { tipo: 'truque', selo: 'O zero manda', linhas: ['Tem 0 multiplicando? Tudo vira 0.'], legenda: 'Se ve um zero na conta de vezes, a resposta e zero. Sempre procure o zero antes!' }
      ],
      mnemo: { icone: '💕', titulo: 'A regra do namoro', texto: 'Amigo do meu amigo e amigo. Inimigo do meu inimigo tambem vira amigo. So o amigo do inimigo vira inimigo.' },
      papoFalado: { pergunta: 'Pai pergunta: "menos 3 vezes menos 2, da mais ou menos?"', resposta: 'Ela responde: "mais! sinais iguais da mais."' },
      erro: { x: 'Na prova ela fez (−5)·0·(−1)·(+2) e deu −10. Esqueceu do zero.', v: 'Tem zero na conta → a resposta e 0. Ler a conta toda antes de comecar.' },
      manha: { qtd: 15, foco: 'So sinais. Comecar facil.', topicId: 1 },
      noite: { qtd: 15, foco: 'Mais 15 de sinais, pra fixar.', topicId: 1, revisa: [] }
    },
    {
      dia: 2, quando: 'Quarta', emoji: '🔢', tema: 'Tipos de numero',
      cor: '#A855F7',
      regras: [
        { tipo: 'ok', selo: 'Numero que vira fracao', linhas: ['Vira fracao? → e RACIONAL'], legenda: 'Numero inteiro, decimal que acaba, ou raiz certinha: todos viram fracao. Sao racionais.' },
        { tipo: 'cuidado', selo: 'Numero esquisito', linhas: ['π e √5 NAO viram fracao'], legenda: 'Tem numeros com virgula que nunca acabam e nunca repetem. Esses sao os esquisitos.' }
      ],
      mnemo: { icone: '🪆', titulo: 'Caixas dentro de caixas', texto: 'Como uma matrioska. A caixa pequena cabe na media, que cabe na grande. √16 e 4: cabe em todas!' },
      papoFalado: { pergunta: 'Pai pergunta: "o numero 4 vira fracao?"', resposta: 'Ela responde: "vira! 4 e racional."' },
      erro: { x: 'Na prova ela deixou √16 sem resolver e errou onde colocar.', v: 'Resolve a raiz primeiro: √16 e 4. Depois pensa onde 4 mora.' },
      manha: { qtd: 15, foco: 'Tipos de numero. Tema novo.', topicId: 2 },
      noite: { qtd: 15, foco: '8 de tipos de numero + 7 de sinais (Dia 1).', topicId: 2, revisa: [1] }
    },
    {
      dia: 3, quando: 'Quinta', emoji: '🍕', tema: 'Contas com fracao',
      cor: '#EC4899',
      regras: [
        { tipo: 'ok', selo: 'Comparar virgula', linhas: ['1,1201   e   1,121'], legenda: 'Coloca um embaixo do outro. Olha numero por numero, da esquerda pra direita.' }
      ],
      mnemo: { icone: '🦋', titulo: 'Borboleta e KFC', texto: 'Somar fracao: borboleta (multiplica em X). Dividir fracao: KFC - mantem a primeira, vira a segunda, troca por vezes.' },
      papoFalado: { pergunta: 'Pai pergunta: "qual e maior, 1,121 ou 1,1201?"', resposta: 'Ela responde olhando casa por casa.' },
      erro: { x: 'Na prova ela comparou virgulas sem alinhar e se perdeu.', v: 'Coloca um embaixo do outro. Compara cada numero, na ordem.' },
      manha: { qtd: 15, foco: 'Contas com fracao. Tema novo.', topicId: 3 },
      noite: { qtd: 15, foco: '8 de fracao + 7 dos Dias 1 e 2.', topicId: 3, revisa: [1, 2] }
    },
    {
      dia: 4, quando: 'Sexta', emoji: '🧠', tema: 'Potencias', prioridade: true,
      cor: '#F59E0B',
      regras: [
        { tipo: 'ok', selo: 'O numero pequeno de cima', linhas: ['Vezes → SOMA os de cima', 'Dividir → DIMINUI os de cima', 'Potencia de potencia → VEZES'], legenda: 'O numero pequeninho la em cima e quem manda. Olha se e vezes, dividir ou os dois.' },
        { tipo: 'truque', selo: 'O menos 1 e especial', linhas: ['(−1) com cima par = +1', '(−1) com cima impar = −1'], legenda: 'Numero de cima par vira mais 1. Numero de cima impar vira menos 1. So olhar par ou impar!' }
      ],
      mnemo: { icone: '🧠', titulo: 'PaPoMuDiSuSo', texto: 'A ordem de resolver: Parenteses, Potencias, Multiplica/Divide, Subtrai/Soma. Sempre nessa fila.' },
      papoFalado: { pergunta: 'Pai pergunta: "menos 1 elevado a 4. Da mais ou menos?"', resposta: 'Ela responde: "mais! porque 4 e par."' },
      erro: { x: 'Na prova ela somou os numeros de cima na divisao. O certo era diminuir.', v: 'Dividindo? DIMINUI os de cima. 4 menos 2 da 2. Depois resolve o resto.' },
      manha: { qtd: 15, foco: 'Potencias. Tema novo. Bem devagar!', topicId: 4 },
      noite: { qtd: 15, foco: '8 de potencias + 7 dos Dias 1 a 3.', topicId: 4, revisa: [1, 2, 3] }
    },
    {
      dia: 5, quando: 'Sabado', emoji: '🎯', tema: 'Raiz quadrada',
      cor: '#10B981',
      regras: [
        { tipo: 'ok', selo: 'Raizes pra decorar', linhas: ['√4=2  √9=3  √16=4  √25=5', '√36=6  √49=7  √64=8  √81=9', '√100=10  √121=11  √144=12'], legenda: 'Decora essas como uma musiquinha. Resolve quase toda raiz da prova!' },
        { tipo: 'cuidado', selo: 'Raiz de numero negativo', linhas: ['√−25 NAO EXISTE'], legenda: 'Mais vezes mais da mais. Menos vezes menos tambem da mais. Nunca sobra um menos.' }
      ],
      mnemo: { icone: '🗣️', titulo: 'Fala primeiro, escreve depois', texto: 'Na prova ela sabia mas travou pra escrever. Truque: fala a resposta em voz alta, depois copia uma frase curtinha.' },
      papoFalado: { pergunta: 'Pai pergunta: "por que raiz de menos 25 nao existe?"', resposta: 'Ela responde falando, do jeito dela. Depois copia: "porque nenhum numero vezes ele mesmo da menos".' },
      erro: { x: 'Na prova (Q6) ela sabia a resposta mas embolou ao escrever.', v: 'Resposta curta: "Nao existe. Nenhum numero vezes ele mesmo da menos." Q8 era so √36+√121 = 6+11 = 17.' },
      manha: { qtd: 15, foco: 'Raiz quadrada. Tema novo.', topicId: 5 },
      noite: { qtd: 15, foco: '8 de raiz + 7 dos Dias 1 a 4.', topicId: 5, revisa: [1, 2, 3, 4] }
    },
    {
      dia: 6, quando: 'Domingo', emoji: '🔑', tema: 'A letra que vale numero',
      cor: '#3B82F6',
      regras: [
        { tipo: 'ok', selo: 'A letra fica', linhas: ['A letra e a resposta!'], legenda: 'Quando nao sei o numero, uso uma letra. A letra fica na resposta. Ela nao some.' },
        { tipo: 'truque', selo: 'Quando troca a letra', linhas: ['So troca se o exercicio der o valor'], legenda: 'Se o exercicio diz "x vale 2", ai troca. Se nao diz nada, a letra fica do jeito que esta.' }
      ],
      mnemo: { icone: '📦', titulo: 'A letra e uma caixa fechada', texto: 'A letra e uma caixa que ainda nao abri. Nao sei o que tem dentro. Entao ela viaja junto na resposta, fechada.' },
      papoFalado: { pergunta: 'Pai pergunta: "se cada calca custa 50 e tem o x, como fica?"', resposta: 'Ela responde: "50 vezes x" e percebe que o x fica.' },
      erro: { x: 'Na prova (Q11) ela inventou que x era 60 e fez conta. Achou que o x tinha que sumir.', v: 'A resposta era 3000 + 50x. A letra fica na resposta. Ela mora ali.' },
      manha: { qtd: 15, foco: 'A letra que vale numero. Tema novo.', topicId: 6 },
      noite: { qtd: 15, foco: '8 da letra + 7 dos Dias 1 a 5.', topicId: 6, revisa: [1, 2, 3, 4, 5] }
    },
    {
      dia: 7, quando: 'Segunda', emoji: '🏆', tema: 'Treino final', simulado: true,
      cor: '#6C5CE7',
      checklist: [
        'Procurei o zero nas contas de vezes',
        'Sinais iguais da mais, diferentes da menos',
        'Potencia: vezes soma, dividir diminui',
        'Raiz de numero negativo nao existe',
        'A letra fica na resposta',
        'Revisei tudo antes de entregar'
      ],
      papoFalado: { pergunta: 'Pai diz: "vamos so conferir, sem pressa."', resposta: 'Ela faz com calma e revisa no fim.' },
      manha: { qtd: 15, foco: 'Prova de mentira, parte 1. Sem materia nova.', simulado: true },
      noite: { qtd: 15, foco: 'Prova de mentira, parte 2 + corrigir com o pai.', simulado: true }
    }
  ]
};

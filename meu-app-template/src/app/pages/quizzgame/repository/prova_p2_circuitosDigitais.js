export const questions = [
  {
    id: 0,
    question: "Qual é a função básica de uma porta lógica AND?",
    difficulty: "Fácil",
    options: {
      a: "Saída é 1 apenas se todas as entradas forem 1",
      b: "Saída é 1 se pelo menos uma entrada for 1",
      c: "Saída é sempre o inverso da entrada",
      d: "Saída é 1 se as entradas forem diferentes"
    },
    correctAnswer: "a"
  },
  {
    id: 1,
    question: "Qual é a principal diferença entre um circuito combinacional e um circuito sequencial?",
    difficulty: "Médio",
    options: {
      a: "Circuitos combinacionais usam flip-flops, enquanto sequenciais não.",
      b: "Circuitos sequenciais têm memória e dependem de estados anteriores, enquanto combinacionais não.",
      c: "Circuitos combinacionais usam clock, enquanto sequenciais não.",
      d: "Circuitos sequenciais só usam portas AND e OR."
    },
    correctAnswer: "b"
  },
  {
    id: 2,
    question: "O que define um latch como um elemento de memória sensível ao nível?",
    difficulty: "Médio",
    options: {
      a: "Ele muda de estado apenas na borda de um sinal de clock.",
      b: "Ele muda de estado enquanto o sinal de entrada de controle estiver em um nível ativo.",
      c: "Ele não precisa de nenhuma entrada para funcionar.",
      d: "Ele armazena dados apenas temporariamente."
    },
    correctAnswer: "b"
  },
  {
    id: 3,
    question: "Qual a função do sinal de clock em circuitos síncronos?",
    difficulty: "Médio",
    options: {
      a: "Para resetar os flip-flops.",
      b: "Para habilitar as portas lógicas.",
      c: "Para sincronizar as mudanças de estado dos circuitos.",
      d: "Para contar os pulsos de entrada."
    },
    correctAnswer: "c"
  },
  {
    id: 4,
    question: "Em um flip-flop SR com clock, qual a condição para que a saída Q seja setada (ir para 1)?",
    difficulty: "Médio",
    options: {
      a: "S=0, R=1 e borda de descida no clock.",
      b: "S=1, R=0 e borda de subida no clock.",
      c: "S=1, R=1 e qualquer nível no clock.",
      d: "S=0, R=0 e qualquer nível no clock."
    },
    correctAnswer: "b"
  },
  {
    id: 5,
    question: "Qual é a principal característica do flip-flop JK que o diferencia do flip-flop SR?",
    difficulty: "Médio",
    options: {
      a: "O flip-flop JK não precisa de clock.",
      b: "O flip-flop JK tem uma entrada adicional.",
      c: "O flip-flop JK não tem a condição de ambiguidade quando J=K=1, alternando seu estado.",
      d: "O flip-flop JK sempre reseta a saída."
    },
    correctAnswer: "c"
  },
  {
    id: 6,
    question: "Em um flip-flop do tipo D, qual o efeito da entrada D na saída Q em uma borda de clock?",
    difficulty: "Médio",
    options: {
      a: "A saída Q sempre inverte o valor da entrada D.",
      b: "A saída Q assume o mesmo valor da entrada D.",
      c: "A saída Q não é afetada pela entrada D.",
      d: "A saída Q vai para um estado aleatório."
    },
    correctAnswer: "b"
  },
  {
    id: 7,
    question: "O que acontece com a saída de um flip-flop T quando a entrada T=1 e ocorre uma borda de clock?",
    difficulty: "Médio",
    options: {
      a: "A saída permanece no mesmo estado.",
      b: "A saída vai para nível alto (1).",
      c: "A saída vai para nível baixo (0).",
      d: "A saída alterna para o estado oposto (toggle)."
    },
    correctAnswer: "d"
  },
  {
    id: 8,
    question: "Qual a função de um contador em um circuito digital?",
    difficulty: "Médio",
    options: {
      a: "Armazenar dados binários.",
      b: "Gerar sinais de clock.",
      c: "Contar eventos (pulsos de clock).",
      d: "Controlar a velocidade de outros circuitos."
    },
    correctAnswer: "c"
  },
  {
    id: 9,
    question: "Se um contador é formado por 4 flip-flops, qual o módulo desse contador?",
    difficulty: "Médio",
    options: {
      a: "4",
      b: "8",
      c: "16",
      d: "32"
    },
    correctAnswer: "c"
  },
  {
    id: 10,
    question: "Qual é o conceito de tempo de setup (ts) em relação aos flip-flops com clock?",
    difficulty: "Médio",
    options: {
      a: "O tempo de duração do pulso de clock.",
      b: "O tempo que a entrada de controle deve ficar estável antes da borda do clock.",
      c: "O tempo que a saída demora para responder à entrada.",
      d: "O tempo que a entrada deve ficar estável após a borda do clock."
    },
    correctAnswer: "b"
  },
  {
    id: 11,
    question: "Um contador possui seis flip-flops conectados (Q5, Q4, Q3, Q2, Q1, Q0). Qual é o módulo deste contador?",
    difficulty: "Médio",
    options: {
      a: "16",
      b: "32",
      c: "64",
      d: "128"
    },
    correctAnswer: "c"
  },
  {
    id: 12,
    question: "Se a frequência do clock de entrada de um contador de 6 flip-flops for 1 MHz, qual a frequência na saída do último flip-flop (Q5)?",
    difficulty: "Difícil",
    options: {
      a: "1 MHz",
      b: "500 kHz",
      c: "31.25 kHz",
      d: "15.625 kHz"
    },
    correctAnswer: "d"
  },
  {
    id: 13,
    question: "Um latch NAND é inicializado com SET=RESET=1. Qual a consequência?",
    difficulty: "Médio",
    options: {
      a: "A saída Q é sempre 1.",
      b: "A saída Q é sempre 0.",
      c: "O estado inicial da saída é imprevisível.",
      d: "O latch não funciona."
    },
    correctAnswer: "c"
  },
  {
    id: 14,
    question: "Em um circuito com um latch NAND, se SET=0 e RESET=1, qual o valor da saída Q?",
    difficulty: "Médio",
    options: {
      a: "Q=0",
      b: "Q=1",
      c: "Q não se altera",
      d: "Q é indefinido"
    },
    correctAnswer: "b"
  },
  {
    id: 15,
    question: "Qual a função de um circuito detector de borda em um flip-flop disparado por borda?",
    difficulty: "Médio",
    options: {
      a: "Amplificar o sinal de clock.",
      b: "Gerar um pulso estreito na transição do clock para ativar o latch.",
      c: "Manter o nível do clock constante.",
      d: "Reduzir o ruído no sinal de clock."
    },
    correctAnswer: "b"
  },
  {
    id: 16,
    question: "Em um circuito com um latch NAND, se SET=1 e RESET=0, qual o valor da saída Q?",
    difficulty: "Médio",
    options: {
      a: "Q=0",
      b: "Q=1",
      c: "Q é indefinido",
      d: "Q é imprevisível"
    },
    correctAnswer: "a"
  },

  {
    id: 17,
    question: "Defina pulso positivo e negativo em circuitos digitais. As transições alto e baixo são instantâneas?",
    difficulty: "Difícil",
    options: {
      a: "Pulso positivo é quando a tensão vai de baixo para alto, e pulso negativo é o contrário.",
      b: "As transições são instantâneas em circuitos ideais, mas na prática, há um tempo de subida e descida.",
      c: "Pulso positivo e negativo referem-se à polaridade da tensão em relação ao terra.",
      d: "As transições são sempre lentas devido à capacitância dos componentes."
    },
    correctAnswer: "b"
  },
  {
    id: 18,
    question: "Qual a diferença entre inversor e Schmitt trigger?",
    difficulty: "Difícil",
    options: {
      a: "O inversor apenas inverte o sinal, enquanto o Schmitt trigger tem histerese.",
      b: "O inversor é um circuito linear, enquanto o Schmitt trigger é um circuito digital.",
      c: "O inversor tem uma única tensão de entrada, enquanto o Schmitt trigger tem duas.",
      d: "O inversor é mais rápido que o Schmitt trigger."
    },
    correctAnswer: "a"
  },
  {
    id: 19,
    question: "Cite 3 tipos de multivibradores. O que representa estado estável e quase estável?",
    difficulty: "Difícil",
    options: {
      a: "Multivibrador astável, monostável e bistável. Estado estável é quando o circuito permanece em um estado, e quase estável é quando ele muda rapidamente entre estados.",
      b: "Multivibrador de pulso, de onda e de frequência. Estado estável é um estado de equilíbrio, enquanto quase estável é um estado temporário.",
      c: "Multivibrador de onda quadrada, triangular e senoidal. Estado estável é quando o circuito não muda, e quase estável é quando ele está prestes a mudar.",
      d: "Multivibrador de baixa frequência, alta frequência e média frequência. Estado estável é quando a frequência é constante."
    },
    correctAnswer: "a"
  },
  {
    id: 20,
    question: "Quais componentes eletrônicos são usados para determinar o tempo de estado de multivibradores?",
    difficulty: "Difícil",
    options: {
      a: "Resistores e capacitores.",
      b: "Transistores e diodos.",
      c: "Indutores e capacitores.",
      d: "Somente resistores."
    },
    correctAnswer: "a"
  },
  {
    id: 21,
    question: "Explique os 4 tipos de flip-flop.",
    difficulty: "Difícil",
    options: {
      a: "Flip-flop SR, JK, D e T. Cada um tem características e funções diferentes para armazenar e mudar estados.",
      b: "Flip-flop de onda, de pulso, de frequência e de clock.",
      c: "Flip-flop analógico, digital, linear e não linear.",
      d: "Flip-flop de alta velocidade, baixa velocidade, de pulso e de estado."
    },
    correctAnswer: "a"
  }
];
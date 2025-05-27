export const questions = [
  {
    id: 1,
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
    id: 2,
    question: "Em um Flip-Flop JK, o que acontece quando J=1 e K=1?",
    difficulty: "Médio",
    options: {
      a: "O Flip-Flop mantém seu estado anterior",
      b: "O Flip-Flop alterna seu estado (toggle)",
      c: "A saída vai para nível alto (1)",
      d: "A saída vai para nível baixo (0)"
    },
    correctAnswer: "b"
  },
  {
    id: 3,
    question: "Qual é a contagem máxima de um contador digital de 4 bits?",
    difficulty: "Fácil",
    options: {
      a: "8",
      b: "16",
      c: "15",
      d: "32"
    },
    correctAnswer: "c"
  },
  {
    id: 4,
    question: "Em um projeto prático, você precisa dividir a frequência de um clock por 2. Qual circuito você usaria?",
    difficulty: "Médio",
    options: {
      a: "Um Flip-Flop T com T=1",
      b: "Duas portas AND em série",
      c: "Um multiplexador 2:1",
      d: "Um contador de década"
    },
    correctAnswer: "a"
  },
  {
    id: 5,
    question: "Para implementar um semáforo digital, qual seria a melhor escolha de circuito sequencial?",
    difficulty: "Difícil",
    options: {
      a: "Um contador assíncrono",
      b: "Uma máquina de estados finitos",
      c: "Um registrador de deslocamento",
      d: "Um decodificador"
    },
    correctAnswer: "b"
  },
  {
    id: 6,
    question: "Em um projeto de contador digital usando Flip-Flops JK, como você faria para o contador voltar a zero quando atingir o número 6?",
    difficulty: "Difícil",
    options: {
      a: "Usar um decodificador 3:8",
      b: "Adicionar uma porta AND na saída",
      c: "Usar lógica combinacional para detectar 6 e resetar os Flip-Flops",
      d: "Simplesmente conectar o clear de todos os Flip-Flops"
    },
    correctAnswer: "c"
  },
  {
    id: 7,
    question: "Qual é o problema prático que pode ocorrer em um contador assíncrono de alta frequência?",
    difficulty: "Médio",
    options: {
      a: "Consumo excessivo de energia",
      b: "Glitches devido ao atraso de propagação",
      c: "Aquecimento dos componentes",
      d: "Interferência eletromagnética"
    },
    correctAnswer: "b"
  },
  {
    id: 8,
    question: "Em um projeto de display de 7 segmentos, qual componente é essencial entre o contador e o display?",
    difficulty: "Médio",
    options: {
      a: "Um multiplexador",
      b: "Um decodificador BCD para 7 segmentos",
      c: "Um demultiplexador",
      d: "Um registrador"
    },
    correctAnswer: "b"
  },
  {
    id: 9,
    question: "Para criar um gerador de sequência pseudoaleatória, qual circuito seria mais apropriado?",
    difficulty: "Difícil",
    options: {
      a: "Registrador de deslocamento com realimentação linear (LFSR)",
      b: "Contador Johnson",
      c: "Contador em anel",
      d: "Contador década"
    },
    correctAnswer: "a"
  },
  {
    id: 10,
    question: "Em um projeto de memória RAM básica, qual é a função do sinal de chip select (CS)?",
    difficulty: "Médio",
    options: {
      a: "Selecionar entre leitura e escrita",
      b: "Ativar ou desativar o chip de memória",
      c: "Selecionar o endereço de memória",
      d: "Controlar a velocidade de acesso"
    },
    correctAnswer: "b"
  }
];
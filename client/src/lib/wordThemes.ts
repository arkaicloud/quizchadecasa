export interface WordTheme {
  id: string;
  name: string;
  icon: string;
  words: string[][];
}

export const WORD_THEMES: WordTheme[] = [
  {
    id: 'paises',
    name: 'Países',
    icon: '🌍',
    words: [
      ['BRASIL', 'JAPAO', 'FRANCA', 'ITALIA', 'CANADA', 'MEXICO', 'EGITO'],
      ['CHINA', 'INDIA', 'RUSSIA', 'PERU', 'CHILE', 'CUBA', 'GRECIA'],
      ['PORTUGAL', 'ESPANHA', 'COLOMBIA', 'ARGENTINA', 'TURQUIA', 'SUECIA', 'NORUEGA'],
      ['IRLANDA', 'AUSTRIA', 'BELGICA', 'MARROCOS', 'NIGERIA', 'ANGOLA', 'PANAMA'],
    ],
  },
  {
    id: 'cidades',
    name: 'Cidades',
    icon: '🏙️',
    words: [
      ['PARIS', 'ROMA', 'TOQUIO', 'LONDRES', 'MADRI', 'BERLIM', 'DUBAI'],
      ['CAIRO', 'LIMA', 'OSLO', 'PRAGA', 'VIENA', 'ATENAS', 'SEUL'],
      ['LISBOA', 'MOSCOU', 'SYDNEY', 'MIAMI', 'BOSTON', 'DUBLIN', 'MILAO'],
      ['RECIFE', 'SANTOS', 'CUIABA', 'MANAUS', 'BELEM', 'NATAL', 'PALMAS'],
    ],
  },
  {
    id: 'objetos',
    name: 'Objetos',
    icon: '🔧',
    words: [
      ['CADEIRA', 'MESA', 'LAMPADA', 'RELOGIO', 'ESPELHO', 'JANELA', 'QUADRO'],
      ['CANETA', 'LIVRO', 'CHAVE', 'COPO', 'PRATO', 'GARFO', 'FACA'],
      ['TOALHA', 'VASO', 'BOLSA', 'MALA', 'CAIXA', 'SACOLA', 'TAPETE'],
      ['MARTELO', 'TESOURA', 'PANELA', 'BALDE', 'ESCOVA', 'VASSOURA', 'PILHA'],
    ],
  },
  {
    id: 'animais',
    name: 'Animais',
    icon: '🐾',
    words: [
      ['CACHORRO', 'GATO', 'CAVALO', 'COELHO', 'LEAO', 'TIGRE', 'PANDA'],
      ['BALEIA', 'GOLFINHO', 'TUBARAO', 'POLVO', 'CORUJA', 'PAPAGAIO', 'PINGUIM'],
      ['COBRA', 'JACARE', 'TARTARUGA', 'CAMELO', 'GIRAFA', 'ZEBRA', 'MACACO'],
      ['LOBO', 'RAPOSA', 'URSO', 'FALCAO', 'ARARA', 'SAPO', 'TATU'],
    ],
  },
  {
    id: 'alimentos',
    name: 'Alimentos',
    icon: '🍎',
    words: [
      ['BANANA', 'MORANGO', 'LARANJA', 'ABACAXI', 'MELANCIA', 'MANGA', 'LIMAO'],
      ['ARROZ', 'FEIJAO', 'BATATA', 'CENOURA', 'TOMATE', 'CEBOLA', 'ALFACE'],
      ['QUEIJO', 'PRESUNTO', 'SALAME', 'MANTEIGA', 'BISCOITO', 'MACARRAO', 'FARINHA'],
      ['CAFE', 'LEITE', 'SUCO', 'AGUA', 'PUDIM', 'TORTA', 'BOLO'],
    ],
  },
  {
    id: 'esportes',
    name: 'Esportes',
    icon: '⚽',
    words: [
      ['FUTEBOL', 'BASQUETE', 'VOLEI', 'TENIS', 'NATACAO', 'BOXE', 'SURFE'],
      ['GOLFE', 'RUGBY', 'HANDEBOL', 'JUDO', 'KARATE', 'CICLISMO', 'REMO'],
      ['ESQUI', 'POLO', 'ESGRIMA', 'HIPISMO', 'LUTA', 'SALTO', 'CORRIDA'],
      ['XADREZ', 'SINUCA', 'BOLICHE', 'SKATE', 'TRILHA', 'RAPEL', 'MERGULHO'],
    ],
  },
  {
    id: 'profissoes',
    name: 'Profissões',
    icon: '👨‍💼',
    words: [
      ['MEDICO', 'ADVOGADO', 'PROFESSOR', 'BOMBEIRO', 'PILOTO', 'DENTISTA', 'PADEIRO'],
      ['PINTOR', 'CANTOR', 'ATOR', 'CHEF', 'JUIZ', 'POETA', 'MUSICO'],
      ['GERENTE', 'SOLDADO', 'PEDREIRO', 'CARTEIRO', 'PORTEIRO', 'BARBEIRO', 'COSTUREIRA'],
      ['MOTORISTA', 'ENFERMEIRO', 'CIENTISTA', 'FOTOGRAFO', 'ARQUITETO', 'DESIGNER', 'POLICIAL'],
    ],
  },
  {
    id: 'cores',
    name: 'Cores',
    icon: '🎨',
    words: [
      ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'ROXO', 'LARANJA', 'ROSA'],
      ['BRANCO', 'PRETO', 'CINZA', 'MARROM', 'BEGE', 'DOURADO', 'PRATA'],
      ['VIOLETA', 'CARMIM', 'CORAL', 'TURQUESA', 'SAFIRA', 'SALMAO', 'CREME'],
      ['OLIVA', 'MAGENTA', 'VINHO', 'COBRE', 'MARFIM', 'INDIGO', 'OCRE'],
    ],
  },
  {
    id: 'familia',
    name: 'Família',
    icon: '👨‍👩‍👧‍👦',
    words: [
      ['FAMILIA', 'AMOR', 'UNIAO', 'CARINHO', 'RESPEITO', 'ABRACO', 'SAUDADE'],
      ['MAE', 'PAI', 'FILHO', 'FILHA', 'IRMAO', 'IRMA', 'PRIMO'],
      ['AVO', 'NETO', 'TIO', 'TIA', 'SOGRO', 'CUNHADO', 'PADRINHO'],
      ['CASA', 'LAR', 'AFETO', 'CORACAO', 'ALEGRIA', 'MEMORIA', 'FUTURO'],
    ],
  },
  {
    id: 'natureza',
    name: 'Natureza',
    icon: '🌿',
    words: [
      ['FLORESTA', 'MONTANHA', 'OCEANO', 'CACHOEIRA', 'DESERTO', 'LAGO', 'VULCAO'],
      ['ARVORE', 'FLOR', 'FOLHA', 'SEMENTE', 'RAIZ', 'TRONCO', 'GALHO'],
      ['SOL', 'LUA', 'ESTRELA', 'NUVEM', 'CHUVA', 'VENTO', 'ARCOIRIS'],
      ['RIO', 'MAR', 'PRAIA', 'ILHA', 'GRUTA', 'VALE', 'CAMPO'],
    ],
  },
];

export function getRandomWordsForTheme(themeId: string): string[] {
  const theme = WORD_THEMES.find(t => t.id === themeId);
  if (!theme) return WORD_THEMES[0].words[0];
  const randomIndex = Math.floor(Math.random() * theme.words.length);
  return theme.words[randomIndex];
}

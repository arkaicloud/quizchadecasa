export interface WordTheme {
  id: string;
  name: string;
  icon: string;
  pool: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const WORD_THEMES: WordTheme[] = [
  {
    id: 'paises',
    name: 'Países',
    icon: '🌍',
    pool: [
      'BRASIL', 'JAPAO', 'FRANCA', 'ITALIA', 'CANADA', 'MEXICO', 'EGITO',
      'CHINA', 'INDIA', 'RUSSIA', 'PERU', 'CHILE', 'CUBA', 'GRECIA',
      'PORTUGAL', 'ESPANHA', 'COLOMBIA', 'ARGENTINA', 'TURQUIA', 'SUECIA', 'NORUEGA',
      'IRLANDA', 'AUSTRIA', 'BELGICA', 'MARROCOS', 'NIGERIA', 'ANGOLA', 'PANAMA',
      'BOLIVIA', 'PARAGUAI', 'URUGUAI', 'EQUADOR', 'HAITI', 'JAMAICA', 'QATAR',
      'ISRAEL', 'LIBANO', 'SIRIA', 'COREIA', 'NEPAL', 'MALASIA', 'HUNGRIA',
      'ROMENIA', 'SERVIA', 'CROACIA', 'ESTONIA', 'LETONIA', 'FINLANDIA', 'ISLANDIA',
      'CHIPRE', 'MALTA', 'LIBIA', 'GANA', 'QUENIA', 'SOMALIA', 'CAMAROES',
      'SENEGAL', 'ZAMBIA', 'UGANDA', 'RUANDA', 'CONGO', 'MONACO', 'SUICA',
    ],
  },
  {
    id: 'cidades',
    name: 'Cidades',
    icon: '🏙️',
    pool: [
      'PARIS', 'ROMA', 'TOQUIO', 'LONDRES', 'MADRI', 'BERLIM', 'DUBAI',
      'CAIRO', 'LIMA', 'OSLO', 'PRAGA', 'VIENA', 'ATENAS', 'SEUL',
      'LISBOA', 'MOSCOU', 'SYDNEY', 'MIAMI', 'BOSTON', 'DUBLIN', 'MILAO',
      'RECIFE', 'SANTOS', 'CUIABA', 'MANAUS', 'BELEM', 'NATAL', 'PALMAS',
      'CURITIBA', 'GOIANIA', 'VITORIA', 'ARACAJU', 'MACAPA', 'TERESINA', 'MACEIO',
      'FORTALEZA', 'SALVADOR', 'CAMPINAS', 'NITEROI', 'GUARULHOS', 'CANOAS', 'MARINGA',
      'PELOTAS', 'CAXIAS', 'BAURU', 'JUNDIAI', 'FRANCA', 'SOROCABA', 'OSASCO',
      'BOGOTA', 'HAVANA', 'PEQUIM', 'XANGAI', 'TORONTO', 'VANCOUVER', 'NAIROBI',
      'BANGCOC', 'JACARTA', 'HANOI', 'DACAR', 'LUANDA', 'RABAT', 'MAPUTO',
    ],
  },
  {
    id: 'objetos',
    name: 'Objetos',
    icon: '🔧',
    pool: [
      'CADEIRA', 'MESA', 'LAMPADA', 'RELOGIO', 'ESPELHO', 'JANELA', 'QUADRO',
      'CANETA', 'LIVRO', 'CHAVE', 'COPO', 'PRATO', 'GARFO', 'FACA',
      'TOALHA', 'VASO', 'BOLSA', 'MALA', 'CAIXA', 'SACOLA', 'TAPETE',
      'MARTELO', 'TESOURA', 'PANELA', 'BALDE', 'ESCOVA', 'VASSOURA', 'PILHA',
      'AGENDA', 'LAPIS', 'BORRACHA', 'REGUA', 'MOEDA', 'CARTEIRA', 'CHINELO',
      'SAPATO', 'OCULOS', 'GUARDA', 'PORTA', 'GAVETA', 'ARMARIO', 'SOFA',
      'CORTINA', 'TRAVESSA', 'GARRAFA', 'XICARA', 'COLHER', 'BANDEJA', 'ESTANTE',
      'MOCHILA', 'ALMOFADA', 'COBERTOR', 'LANTERNA', 'BUSSOLA', 'PENTE', 'PINCEL',
      'FURADEIRA', 'ALICATE', 'PARAFUSO', 'SERROTE', 'ENXADA', 'PREGADOR', 'RODO',
    ],
  },
  {
    id: 'animais',
    name: 'Animais',
    icon: '🐾',
    pool: [
      'CACHORRO', 'GATO', 'CAVALO', 'COELHO', 'LEAO', 'TIGRE', 'PANDA',
      'BALEIA', 'GOLFINHO', 'TUBARAO', 'POLVO', 'CORUJA', 'PAPAGAIO', 'PINGUIM',
      'COBRA', 'JACARE', 'TARTARUGA', 'CAMELO', 'GIRAFA', 'ZEBRA', 'MACACO',
      'LOBO', 'RAPOSA', 'URSO', 'FALCAO', 'ARARA', 'SAPO', 'TATU',
      'FORMIGA', 'ABELHA', 'BORBOLETA', 'JOANINHA', 'GRILO', 'CIGARRA', 'LAGARTO',
      'FOCA', 'MORSA', 'LHAMA', 'ALPACA', 'CASTOR', 'LONTRA', 'PANTERA',
      'BUFALO', 'BISONTE', 'RINOCERONTE', 'ELEFANTE', 'HIENA', 'CHACAL', 'LINCE',
      'FLAMINGO', 'PELICANO', 'TUCANO', 'GAIVOTA', 'PAVAO', 'CISNE', 'POMBO',
      'DONINHA', 'HAMSTER', 'TEXUGO', 'JAVALI', 'CERVO', 'VEADO', 'ALCE',
    ],
  },
  {
    id: 'alimentos',
    name: 'Alimentos',
    icon: '🍎',
    pool: [
      'BANANA', 'MORANGO', 'LARANJA', 'ABACAXI', 'MELANCIA', 'MANGA', 'LIMAO',
      'ARROZ', 'FEIJAO', 'BATATA', 'CENOURA', 'TOMATE', 'CEBOLA', 'ALFACE',
      'QUEIJO', 'PRESUNTO', 'SALAME', 'MANTEIGA', 'BISCOITO', 'MACARRAO', 'FARINHA',
      'CAFE', 'LEITE', 'SUCO', 'AGUA', 'PUDIM', 'TORTA', 'BOLO',
      'GOIABA', 'ACEROLA', 'CAJU', 'MAMAO', 'MELAO', 'PERA', 'UVA',
      'AMEIXA', 'CEREJA', 'FIGO', 'COCO', 'MARACUJA', 'FRAMBOESA', 'MIRTILO',
      'ESPINAFRE', 'BROCOLIS', 'COUVE', 'PEPINO', 'BERINJELA', 'ABOBRINHA', 'RABANETE',
      'GENGIBRE', 'ALECRIM', 'MANJERICAO', 'OREGANO', 'CANELA', 'CRAVO', 'SALSA',
      'PICANHA', 'COSTELA', 'FRANGO', 'SALMAO', 'BACALHAU', 'SARDINHA', 'ATUM',
    ],
  },
  {
    id: 'esportes',
    name: 'Esportes',
    icon: '⚽',
    pool: [
      'FUTEBOL', 'BASQUETE', 'VOLEI', 'TENIS', 'NATACAO', 'BOXE', 'SURFE',
      'GOLFE', 'RUGBY', 'HANDEBOL', 'JUDO', 'KARATE', 'CICLISMO', 'REMO',
      'ESQUI', 'POLO', 'ESGRIMA', 'HIPISMO', 'LUTA', 'SALTO', 'CORRIDA',
      'XADREZ', 'SINUCA', 'BOLICHE', 'SKATE', 'TRILHA', 'RAPEL', 'MERGULHO',
      'CANOAGEM', 'VELA', 'ARCO', 'TIRO', 'HALTERE', 'GINASTICA', 'ATLETISMO',
      'MARATONA', 'NADO', 'PENTATLO', 'TRIATLO', 'PARKOUR', 'ESCALADA', 'DARDO',
      'DISCO', 'MARTELO', 'BARRA', 'ARGOLA', 'CORDA', 'SLACKLINE', 'KITESURFE',
      'WAKEBOARD', 'WINDSURF', 'TAEKWONDO', 'CAPOEIRA', 'AIKIDO', 'KENDO', 'SUMO',
      'BADMINTON', 'SQUASH', 'PADEL', 'CRICKET', 'SOFTBOL', 'LACROSSE', 'CURLING',
    ],
  },
  {
    id: 'profissoes',
    name: 'Profissões',
    icon: '👨‍💼',
    pool: [
      'MEDICO', 'ADVOGADO', 'PROFESSOR', 'BOMBEIRO', 'PILOTO', 'DENTISTA', 'PADEIRO',
      'PINTOR', 'CANTOR', 'ATOR', 'CHEF', 'JUIZ', 'POETA', 'MUSICO',
      'GERENTE', 'SOLDADO', 'PEDREIRO', 'CARTEIRO', 'PORTEIRO', 'BARBEIRO', 'COSTUREIRA',
      'MOTORISTA', 'ENFERMEIRO', 'CIENTISTA', 'FOTOGRAFO', 'ARQUITETO', 'DESIGNER', 'POLICIAL',
      'DETETIVE', 'BIOLOGO', 'QUIMICO', 'FISICO', 'PSICOLOGO', 'SOCIOLOGO', 'ECONOMISTA',
      'CONTADOR', 'CAIXA', 'GARCOM', 'COZINHEIRO', 'LIXEIRO', 'MECANICO', 'ELETRICISTA',
      'ENCANADOR', 'MARCENEIRO', 'FERREIRO', 'OURIVES', 'JOALHEIRO', 'RELOJOEIRO', 'SAPATEIRO',
      'ALFAIATE', 'ZELADOR', 'VIGIA', 'SEGURANCA', 'GUIA', 'INTERPRETE', 'TRADUTOR',
      'LOCUTOR', 'EDITOR', 'REDATOR', 'ESCRITOR', 'DIRETOR', 'PRODUTOR', 'CAMERAMAN',
    ],
  },
  {
    id: 'cores',
    name: 'Cores',
    icon: '🎨',
    pool: [
      'VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'ROXO', 'LARANJA', 'ROSA',
      'BRANCO', 'PRETO', 'CINZA', 'MARROM', 'BEGE', 'DOURADO', 'PRATA',
      'VIOLETA', 'CARMIM', 'CORAL', 'TURQUESA', 'SAFIRA', 'SALMAO', 'CREME',
      'OLIVA', 'MAGENTA', 'VINHO', 'COBRE', 'MARFIM', 'INDIGO', 'OCRE',
      'LILAS', 'LAVANDA', 'CELESTE', 'JADE', 'ESMERALDA', 'RUBI', 'TOPAZIO',
      'AQUA', 'BRONZE', 'TITANIO', 'GRAFITE', 'PEROLA', 'AREIA', 'NEVE',
      'CEREJA', 'PESSEGO', 'MOSTARDA', 'LIMAO', 'MENTA', 'CARAMELO', 'BORGONHA',
      'TERRACOTA', 'TABACO', 'CASTANHO', 'CANELA', 'FERRUGEM', 'CARVAO', 'GELO',
    ],
  },
  {
    id: 'familia',
    name: 'Família',
    icon: '👨‍👩‍👧‍👦',
    pool: [
      'FAMILIA', 'AMOR', 'UNIAO', 'CARINHO', 'RESPEITO', 'ABRACO', 'SAUDADE',
      'MAE', 'PAI', 'FILHO', 'FILHA', 'IRMAO', 'IRMA', 'PRIMO',
      'AVO', 'NETO', 'TIO', 'TIA', 'SOGRO', 'CUNHADO', 'PADRINHO',
      'CASA', 'LAR', 'AFETO', 'CORACAO', 'ALEGRIA', 'MEMORIA', 'FUTURO',
      'BENCAO', 'SORTE', 'DESTINO', 'SONHO', 'ESPERANCA', 'PAZ', 'HARMONIA',
      'PERDAO', 'BONDADE', 'TERNURA', 'CUIDADO', 'PROTECAO', 'HERANCA', 'RAIZ',
      'NINHO', 'ABRIGO', 'REFUGIO', 'CONFORTO', 'CALOR', 'JANTA', 'ALMOCO',
      'NATAL', 'FESTA', 'REUNIAO', 'PASSEIO', 'VIAGEM', 'FERIAS', 'DOMINGO',
      'BATISMO', 'NOIVADO', 'CASAMENTO', 'PROMESSA', 'ALIANCA', 'PADROEIRO', 'ORACAO',
    ],
  },
  {
    id: 'natureza',
    name: 'Natureza',
    icon: '🌿',
    pool: [
      'FLORESTA', 'MONTANHA', 'OCEANO', 'CACHOEIRA', 'DESERTO', 'LAGO', 'VULCAO',
      'ARVORE', 'FLOR', 'FOLHA', 'SEMENTE', 'RAIZ', 'TRONCO', 'GALHO',
      'SOL', 'LUA', 'ESTRELA', 'NUVEM', 'CHUVA', 'VENTO', 'ARCOIRIS',
      'RIO', 'MAR', 'PRAIA', 'ILHA', 'GRUTA', 'VALE', 'CAMPO',
      'SAVANA', 'TUNDRA', 'PANTANAL', 'MANGUE', 'RECIFE', 'CORAL', 'DUNAS',
      'GELEIRA', 'AURORA', 'NEBLINA', 'GRANIZO', 'TROVAO', 'RELAMPAGO', 'TORNADO',
      'BRISA', 'ORVALHO', 'GEADA', 'NEVE', 'MAREMOTO', 'TSUNAMI', 'FURACAO',
      'SAMAMBAIA', 'MUSGO', 'CACTO', 'BAMBU', 'PALMEIRA', 'CIPRES', 'CEDRO',
      'PINHEIRO', 'CARVALHO', 'FIGUEIRA', 'SERINGUEIRA', 'OLIVEIRA', 'MANGUEIRA', 'JATOBA',
    ],
  },
];

export function getRandomWordsForTheme(themeId: string): string[] {
  const theme = WORD_THEMES.find(t => t.id === themeId);
  if (!theme) return shuffle(WORD_THEMES[0].pool).slice(0, 7);

  const uniquePool = [...new Set(theme.pool)];
  const filtered = uniquePool.filter(w => w.length >= 3 && w.length <= 12);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 7);
}

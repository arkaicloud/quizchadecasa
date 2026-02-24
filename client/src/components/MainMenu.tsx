import { Search, Shuffle } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (game: 'wordsearch' | 'unscramble') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl text-foreground mb-2" data-testid="text-main-title">
            Jogos em Família
          </h1>
          <p className="text-muted-foreground font-body text-lg">Escolha um jogo para jogar</p>
        </div>

        <div className="grid gap-4">
          <button
            data-testid="button-game-wordsearch"
            onClick={() => onSelectGame('wordsearch')}
            className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors shrink-0">
                <Search className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-xl text-foreground mb-1">
                  Caça-Palavras
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Encontre as palavras escondidas no grid 12x12. Arraste para selecionar e compita com seus amigos!
                </p>
              </div>
            </div>
          </button>

          <button
            data-testid="button-game-unscramble"
            onClick={() => onSelectGame('unscramble')}
            className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors shrink-0">
                <Shuffle className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-xl text-foreground mb-1">
                  Desembaralha Palavras
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Descubra a palavra original a partir das letras embaralhadas. O primeiro a acertar todas vence!
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

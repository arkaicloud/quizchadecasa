import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateWordSearch } from '@/lib/wordSearchGenerator';
import { apiRequest } from '@/lib/api';
import { Search, Users, Plus, LogIn } from 'lucide-react';

const WORDS = ['SUZANO', 'TATUI', 'FAMILIA', 'MEMORIAS', 'GRATIDAO', 'FUTURO', 'SETEANOS'];
const GRID_SIZE = 12;

interface LobbyProps {
  onJoined: (roomId: string, playerId: string, playerName: string, isAdmin: boolean) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoined }) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'choose' | 'join'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trimmedName = name.trim().slice(0, 30);

  const handleCreate = async () => {
    if (!trimmedName) { setError('Digite seu nome'); return; }
    setLoading(true);
    setError('');
    try {
      const gameData = generateWordSearch(WORDS, GRID_SIZE);
      const room = await apiRequest('POST', '/api/rooms', {
        grid: gameData.grid,
        placedWords: gameData.placedWords,
        words: WORDS,
      });

      const player = await apiRequest('POST', '/api/players', {
        roomId: room.id,
        name: trimmedName,
        isAdmin: true,
      });

      await apiRequest('PATCH', `/api/rooms/${room.id}`, {
        adminPlayerId: player.id,
      });

      onJoined(room.id, player.id, trimmedName, true);
    } catch (e: any) {
      setError('Erro ao criar sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!trimmedName) { setError('Digite seu nome'); return; }
    const code = roomCode.trim().toLowerCase();
    if (!code) { setError('Digite o código da sala'); return; }
    setLoading(true);
    setError('');
    try {
      let room;
      try {
        room = await apiRequest('GET', `/api/rooms/${code}`);
      } catch {
        setError('Sala não encontrada');
        setLoading(false);
        return;
      }
      if (room.status === 'finished') { setError('Esta sala já terminou'); setLoading(false); return; }

      const player = await apiRequest('POST', '/api/players', {
        roomId: room.id,
        name: trimmedName,
        isAdmin: false,
      });

      onJoined(room.id, player.id, trimmedName, false);
    } catch (e: any) {
      setError('Erro ao entrar na sala.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-1" data-testid="text-title">Caça-Palavras</h1>
          <p className="text-muted-foreground font-body">Multiplayer em tempo real</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block font-display font-semibold text-sm text-foreground mb-1.5">
              Seu Nome
            </label>
            <Input
              data-testid="input-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              maxLength={30}
              className="bg-muted border-border font-body"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm font-body" data-testid="text-error">{error}</p>
          )}

          {mode === 'choose' ? (
            <div className="space-y-3 pt-2">
              <Button
                data-testid="button-create-room"
                onClick={handleCreate}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Plus className="w-5 h-5" />
                Criar Sala
              </Button>
              <Button
                data-testid="button-join-mode"
                onClick={() => setMode('join')}
                variant="secondary"
                className="w-full gap-2 font-display font-semibold py-5"
              >
                <LogIn className="w-5 h-5" />
                Entrar em uma Sala
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-display font-semibold text-sm text-foreground mb-1.5">
                  Código da Sala
                </label>
                <Input
                  data-testid="input-room-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Ex: a1b2c3"
                  maxLength={10}
                  className="bg-muted border-border font-body"
                />
              </div>
              <Button
                data-testid="button-join-room"
                onClick={handleJoin}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Users className="w-5 h-5" />
                Entrar
              </Button>
              <Button
                data-testid="button-back"
                onClick={() => setMode('choose')}
                variant="ghost"
                className="w-full font-body text-muted-foreground"
              >
                ← Voltar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;

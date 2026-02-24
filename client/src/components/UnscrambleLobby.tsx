import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { Shuffle, Users, Plus, LogIn, ArrowLeft } from 'lucide-react';

const WORD_PAIRS = [
  { scrambled: 'OEGACNOCH', original: 'ACONCHEGO' },
  { scrambled: 'RLA', original: 'LAR' },
  { scrambled: 'AFLIÍMA', original: 'FAMÍLIA' },
  { scrambled: 'ÇRMOECEO', original: 'RECOMEÇO' },
  { scrambled: 'DIÃOTARG', original: 'GRATIDÃO' },
  { scrambled: 'ÇNÊBO', original: 'BÊNÇÃO' },
  { scrambled: 'ÇRAEANPS', original: 'ESPERANÇA' },
];

interface UnscrambleLobbyProps {
  onJoined: (roomId: string, playerId: string, playerName: string, isAdmin: boolean) => void;
  onBack: () => void;
}

const UnscrambleLobby: React.FC<UnscrambleLobbyProps> = ({ onJoined, onBack }) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'choose' | 'join'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('unscramble');
    if (roomParam) {
      setRoomCode(roomParam);
      setMode('join');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const trimmedName = name.trim().slice(0, 30);

  const handleCreate = async () => {
    if (!trimmedName) { setError('Digite seu nome'); return; }
    setLoading(true);
    setError('');
    try {
      const room = await apiRequest('POST', '/api/unscramble/rooms', {
        words: WORD_PAIRS,
      });

      const player = await apiRequest('POST', '/api/unscramble/players', {
        roomId: room.id,
        name: trimmedName,
        isAdmin: true,
      });

      await apiRequest('PATCH', `/api/unscramble/rooms/${room.id}`, {
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
        room = await apiRequest('GET', `/api/unscramble/rooms/${code}`);
      } catch {
        setError('Sala não encontrada');
        setLoading(false);
        return;
      }
      if (room.status === 'finished') { setError('Esta sala já terminou'); setLoading(false); return; }

      const player = await apiRequest('POST', '/api/unscramble/players', {
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
            <Shuffle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-1" data-testid="text-unscramble-title">Desembaralha</h1>
          <p className="text-muted-foreground font-body">Multiplayer em tempo real</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block font-display font-semibold text-sm text-foreground mb-1.5">
              Seu Nome
            </label>
            <Input
              data-testid="input-unscramble-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              maxLength={30}
              className="bg-muted border-border font-body"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm font-body" data-testid="text-unscramble-error">{error}</p>
          )}

          {mode === 'choose' ? (
            <div className="space-y-3 pt-2">
              <Button
                data-testid="button-unscramble-create"
                onClick={handleCreate}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Plus className="w-5 h-5" />
                Criar Sala
              </Button>
              <Button
                data-testid="button-unscramble-join-mode"
                onClick={() => setMode('join')}
                variant="secondary"
                className="w-full gap-2 font-display font-semibold py-5"
              >
                <LogIn className="w-5 h-5" />
                Entrar em uma Sala
              </Button>
              <Button
                data-testid="button-unscramble-back-menu"
                onClick={onBack}
                variant="ghost"
                className="w-full font-body text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-display font-semibold text-sm text-foreground mb-1.5">
                  Código da Sala
                </label>
                <Input
                  data-testid="input-unscramble-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Ex: a1b"
                  maxLength={10}
                  className="bg-muted border-border font-body"
                />
              </div>
              <Button
                data-testid="button-unscramble-join"
                onClick={handleJoin}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Users className="w-5 h-5" />
                Entrar
              </Button>
              <Button
                data-testid="button-unscramble-back"
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

export default UnscrambleLobby;

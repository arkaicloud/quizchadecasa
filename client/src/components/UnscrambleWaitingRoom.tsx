import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Users, Play, Copy, Check } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
}

interface UnscrambleWaitingRoomProps {
  roomId: string;
  playerId: string;
  playerName: string;
  isAdmin: boolean;
  onGameStart: () => void;
}

const UnscrambleWaitingRoom: React.FC<UnscrambleWaitingRoomProps> = ({
  roomId,
  playerId,
  playerName,
  isAdmin,
  onGameStart,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const onGameStartRef = useRef(onGameStart);
  onGameStartRef.current = onGameStart;

  const joinUrl = `${window.location.origin}?unscramble=${roomId}`;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await apiRequest('GET', `/api/unscramble/rooms/${roomId}/players`);
        setPlayers(data);
      } catch {}
    };
    fetchPlayers();
  }, [roomId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await apiRequest('GET', `/api/unscramble/rooms/${roomId}/players`);
        setPlayers(data);

        const room = await apiRequest('GET', `/api/unscramble/rooms/${roomId}`);
        if (room.status === 'playing') {
          onGameStartRef.current();
        }
      } catch {}
    }, 1500);

    return () => clearInterval(interval);
  }, [roomId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setStarting(true);
    await apiRequest('PATCH', `/api/unscramble/rooms/${roomId}`, { status: 'playing' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Sala de Espera</h1>
          <p className="text-muted-foreground font-body text-sm">
            Desembaralha Palavras · {isAdmin ? 'Aguardando jogadores...' : 'Aguardando o admin iniciar...'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-body">Código da sala</p>
              <p className="font-display font-bold text-xl text-primary tracking-wider" data-testid="text-unscramble-room-code">{roomId}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy} data-testid="button-unscramble-copy">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground font-body">Escaneie para entrar</p>
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG
                value={joinUrl}
                size={160}
                level="M"
                bgColor="#ffffff"
                fgColor="#223150"
              />
            </div>
          </div>

          <div>
            <p className="font-display font-semibold text-sm text-foreground mb-2">
              Jogadores ({players.length})
            </p>
            <ul className="space-y-2">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
                  data-testid={`card-unscramble-player-${p.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-primary text-sm">
                      {p.name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-body text-foreground flex-1">{p.name}</span>
                  {p.isAdmin && (
                    <span className="text-xs font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                  {p.id === playerId && (
                    <span className="text-xs font-body text-muted-foreground">(você)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isAdmin && (
            <Button
              data-testid="button-unscramble-start"
              onClick={handleStart}
              disabled={starting || players.length < 1}
              className="w-full gap-2 font-display font-bold text-lg py-6"
            >
              <Play className="w-5 h-5" />
              Iniciar Partida
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnscrambleWaitingRoom;

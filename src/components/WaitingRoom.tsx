import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Users, Play, Copy, Check } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  is_admin: boolean;
}

interface WaitingRoomProps {
  roomId: string;
  playerId: string;
  playerName: string;
  isAdmin: boolean;
  onGameStart: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  roomId,
  playerId,
  playerName,
  isAdmin,
  onGameStart,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  // Fetch initial players
  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('game_players')
        .select('id, name, is_admin')
        .eq('room_id', roomId)
        .order('created_at');
      if (data) setPlayers(data);
    };
    fetchPlayers();
  }, [roomId]);

  // Subscribe to new players joining
  useEffect(() => {
    const channel = supabase
      .channel(`waiting-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'game_players', filter: `room_id=eq.${roomId}` },
        (payload) => {
          const p = payload.new as any;
          setPlayers(prev => {
            if (prev.find(x => x.id === p.id)) return prev;
            return [...prev, { id: p.id, name: p.name, is_admin: p.is_admin }];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          const room = payload.new as any;
          if (room.status === 'playing') {
            onGameStart();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, onGameStart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setStarting(true);
    await supabase.from('game_rooms').update({ status: 'playing' }).eq('id', roomId);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Sala de Espera</h1>
          <p className="text-muted-foreground font-body text-sm">
            {isAdmin ? 'Aguardando jogadores...' : 'Aguardando o admin iniciar...'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* Room code */}
          <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-body">Código da sala</p>
              <p className="font-display font-bold text-xl text-primary tracking-wider">{roomId}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Player list */}
          <div>
            <p className="font-display font-semibold text-sm text-foreground mb-2">
              Jogadores ({players.length})
            </p>
            <ul className="space-y-2">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-primary text-sm">
                      {p.name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-body text-foreground flex-1">{p.name}</span>
                  {p.is_admin && (
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

          {/* Start button for admin */}
          {isAdmin && (
            <Button
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

export default WaitingRoom;

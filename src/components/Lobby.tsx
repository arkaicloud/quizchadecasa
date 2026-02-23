import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { generateWordSearch } from '@/lib/wordSearchGenerator';
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
      const { data: room, error: roomErr } = await supabase
        .from('game_rooms')
        .insert({
          grid: gameData.grid as any,
          placed_words: gameData.placedWords as any,
          words: WORDS,
          status: 'waiting',
        })
        .select('id')
        .single();
      if (roomErr || !room) throw roomErr;

      const { data: player, error: playerErr } = await supabase
        .from('game_players')
        .insert({ room_id: room.id, name: trimmedName, is_admin: true })
        .select('id')
        .single();
      if (playerErr || !player) throw playerErr;

      await supabase.from('game_rooms').update({ admin_player_id: player.id }).eq('id', room.id);

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
      const { data: room, error: roomErr } = await supabase
        .from('game_rooms')
        .select('id, status')
        .eq('id', code)
        .single();
      if (roomErr || !room) { setError('Sala não encontrada'); setLoading(false); return; }
      if (room.status === 'finished') { setError('Esta sala já terminou'); setLoading(false); return; }

      const { data: player, error: playerErr } = await supabase
        .from('game_players')
        .insert({ room_id: room.id, name: trimmedName, is_admin: false })
        .select('id')
        .single();
      if (playerErr || !player) throw playerErr;

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
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">Caça-Palavras</h1>
          <p className="text-muted-foreground font-body">Multiplayer em tempo real</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block font-display font-semibold text-sm text-foreground mb-1.5">
              Seu Nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              maxLength={30}
              className="bg-muted border-border font-body"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm font-body">{error}</p>
          )}

          {mode === 'choose' ? (
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleCreate}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Plus className="w-5 h-5" />
                Criar Sala
              </Button>
              <Button
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
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Ex: a1b2c3"
                  maxLength={10}
                  className="bg-muted border-border font-body"
                />
              </div>
              <Button
                onClick={handleJoin}
                disabled={loading}
                className="w-full gap-2 font-display font-bold text-lg py-6"
              >
                <Users className="w-5 h-5" />
                Entrar
              </Button>
              <Button
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

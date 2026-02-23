import React, { useState, useCallback } from 'react';
import Lobby from '@/components/Lobby';
import WaitingRoom from '@/components/WaitingRoom';
import MultiplayerGame from '@/components/MultiplayerGame';

type GamePhase = 'lobby' | 'waiting' | 'playing';

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleJoined = useCallback((roomId: string, playerId: string, name: string, admin: boolean) => {
    setRoomId(roomId);
    setPlayerId(playerId);
    setPlayerName(name);
    setIsAdmin(admin);
    setPhase('waiting');
  }, []);

  const handleGameStart = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleBackToLobby = useCallback(() => {
    setPhase('lobby');
    setRoomId('');
    setPlayerId('');
    setPlayerName('');
    setIsAdmin(false);
  }, []);

  if (phase === 'lobby') {
    return <Lobby onJoined={handleJoined} />;
  }

  if (phase === 'waiting') {
    return (
      <WaitingRoom
        roomId={roomId}
        playerId={playerId}
        playerName={playerName}
        isAdmin={isAdmin}
        onGameStart={handleGameStart}
      />
    );
  }

  return (
    <MultiplayerGame
      roomId={roomId}
      playerId={playerId}
      playerName={playerName}
      isAdmin={isAdmin}
      onBackToLobby={handleBackToLobby}
    />
  );
};

export default Index;

import { useState, useCallback } from 'react';
import MainMenu from '@/components/MainMenu';
import Lobby from '@/components/Lobby';
import WaitingRoom from '@/components/WaitingRoom';
import MultiplayerGame from '@/components/MultiplayerGame';
import UnscrambleLobby from '@/components/UnscrambleLobby';
import UnscrambleWaitingRoom from '@/components/UnscrambleWaitingRoom';
import UnscrambleGame from '@/components/UnscrambleGame';

type GameType = 'wordsearch' | 'unscramble';
type GamePhase = 'menu' | 'lobby' | 'waiting' | 'playing';

const Index = () => {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSelectGame = useCallback((game: GameType) => {
    setGameType(game);
    setPhase('lobby');
  }, []);

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

  const handleBackToMenu = useCallback(() => {
    setPhase('menu');
    setGameType(null);
    setRoomId('');
    setPlayerId('');
    setPlayerName('');
    setIsAdmin(false);
  }, []);

  const handleBackToLobby = useCallback(() => {
    setPhase('lobby');
    setRoomId('');
    setPlayerId('');
    setPlayerName('');
    setIsAdmin(false);
  }, []);

  if (phase === 'menu') {
    return <MainMenu onSelectGame={handleSelectGame} />;
  }

  if (gameType === 'wordsearch') {
    if (phase === 'lobby') {
      return <Lobby onJoined={handleJoined} onBack={handleBackToMenu} />;
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
        onBackToLobby={handleBackToMenu}
      />
    );
  }

  if (gameType === 'unscramble') {
    if (phase === 'lobby') {
      return <UnscrambleLobby onJoined={handleJoined} onBack={handleBackToMenu} />;
    }
    if (phase === 'waiting') {
      return (
        <UnscrambleWaitingRoom
          roomId={roomId}
          playerId={playerId}
          playerName={playerName}
          isAdmin={isAdmin}
          onGameStart={handleGameStart}
        />
      );
    }
    return (
      <UnscrambleGame
        roomId={roomId}
        playerId={playerId}
        playerName={playerName}
        isAdmin={isAdmin}
        onBackToLobby={handleBackToMenu}
      />
    );
  }

  return <MainMenu onSelectGame={handleSelectGame} />;
};

export default Index;

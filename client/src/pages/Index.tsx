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

const getInitialState = (): { gameType: GameType | null; phase: GamePhase } => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('room')) {
    return { gameType: 'wordsearch', phase: 'lobby' };
  }
  if (params.get('unscramble')) {
    return { gameType: 'unscramble', phase: 'lobby' };
  }
  return { gameType: null, phase: 'menu' };
};

const Index = () => {
  const initial = getInitialState();
  const [gameType, setGameType] = useState<GameType | null>(initial.gameType);
  const [phase, setPhase] = useState<GamePhase>(initial.phase);
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
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const handleBackToLobby = useCallback(() => {
    setPhase('lobby');
    setRoomId('');
    setPlayerId('');
    setPlayerName('');
    setIsAdmin(false);
  }, []);

  const handleContinue = useCallback(() => {
    setPhase('waiting');
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
        onContinue={handleContinue}
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

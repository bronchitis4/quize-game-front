import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GameBoard from '../components/gameboard/gameboard';
import QuestionView from '../components/question/QuestionView';
import AnswerView from '../components/answer/AnswerView';
import Podium from '../components/podium/Podium';
import HostSidebar from '../components/sidebar/HostSidebar';
import PlayersBar from '../components/playersbar/PlayersBar';
import { saveLastGameData } from '../utils/localGameData';
import JoinGameForm from '../components/forms/JoinGameForm';

const GamePage = ({
  gameState,
  loadPackage,
  startGame,
  selectQuestion,
  buzzIn,
  correctAnswer,
  wrongAnswer,
  skipQuestion,
  nextQuestion,
  getSocketId,
  joinGame
}) => {
  const { gameId } = useParams();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedStatus, setDisplayedStatus] = useState(gameState?.status);
  const [autoJoinTried, setAutoJoinTried] = useState(false);
  console.log('GamePage rendered with gameId:', gameId);

  useEffect(() => {
    if (gameState?.roomId) {
      const lastGameRaw = localStorage.getItem('lastGameData');
      if (lastGameRaw) {
        const lastGame = JSON.parse(lastGameRaw);
        if (!lastGame.id || lastGame.id !== gameState.roomId) {
          saveLastGameData({ ...lastGame, id: gameState.roomId });
        }
      }
    }
  }, [gameState?.roomId]);

  useEffect(() => {
    console.log('GamePage useEffect triggered');
    if (!autoJoinTried) {
      const lastGameRaw = localStorage.getItem('lastGameData');
      if (lastGameRaw) {
        const lastGame = JSON.parse(lastGameRaw);
        if (lastGame.id === gameId) {
          console.log('Auto-joining with saved data');

          joinGame(lastGame.nickname, lastGame.avatar, gameId, lastGame.password);
          console.log('Auto-joining with saved data');
        }
      }
      setAutoJoinTried(true);
    }
  }, [gameId, joinGame, autoJoinTried]);

  useEffect(() => {
    if (gameState?.status !== displayedStatus) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedStatus(gameState?.status);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [gameState?.status, displayedStatus]);

  // If not auto-join, show join form
  if (!gameState && autoJoinTried) {
    return <JoinGameForm joinGame={joinGame} wsLoading={false} />;
  }
  console.log('GamePage rendered with gamestate:', gameState);
  const isHost = gameState?.players?.find(p => p.isHost)?.id === getSocketId();

  const renderGameState = () => {
    switch (displayedStatus) {
      case 'LOBBY':
        return (
          <div className="flex gap-8 justify-center items-center">
            <div className="w-12 h-12 bg-[#0d7bda] rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-[#0d7bda] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-12 h-12 bg-[#0d7bda] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        );
      case 'PLAYING':
        return (
          <GameBoard
            gameState={gameState}
            isHost={isHost}
            selectQuestion={selectQuestion}
            gameId={gameId}
          />
        );
      case 'QUESTION_ACTIVE':
        return (
          <QuestionView
            gameState={gameState}
            isHost={isHost}
            buzzIn={buzzIn}
            gameId={gameId}
            getSocketId={getSocketId}
          />
        );
      case 'ANSWER':
        return (
          <AnswerView
            gameState={gameState}
            isHost={isHost}
            nextQuestion={nextQuestion}
            gameId={gameId}
          />
        );
      case 'FINISHED':
        return <Podium players={gameState.players || []} />;
      case 'ENDED':
        return (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">Гра закінчена!</h2>
          </div>
        );
      default:
        return null;
    }
  };

  if (!gameState) return null;

  return (
    <div className="game-layout flex h-screen bg-[#0f0f0f] gap-2 p-2">
      <HostSidebar
        gameState={gameState}
        gameId={gameId}
        isHost={isHost}
        loadPackage={loadPackage}
        startGame={startGame}
        correctAnswer={correctAnswer}
        wrongAnswer={wrongAnswer}
        skipQuestion={skipQuestion}
        buzzIn={buzzIn}
        getSocketId={getSocketId}
        nextQuestion={nextQuestion}
      />

      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-[#1a1a1a] border-2 border-[#2a2a2a] flex-1 flex items-center justify-center overflow-hidden relative">
          <div
            className={`absolute inset-0 flex items-stretch justify-center transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
            {renderGameState()}
          </div>
        </div>

        <PlayersBar
          players={gameState.players}
          currentAnswerer={gameState.currentAnswerer}
        />
      </div>
    </div>
  );
};

export default GamePage;
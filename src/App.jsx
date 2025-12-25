import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useWebSocket } from './hooks/createConnectionHook';
import CreateGameForm from './components/forms/createGameForm';
import JoinGameForm from './components/forms/joinGameForm';
import JoinByLinkForm from './components/forms/JoinByLinkForm';
import GamePage from './pages/GamePage';

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
      <div className="max-w-sm w-full p-8 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Квіз</h1>
        <Link to="/create" className="block mb-4">
          <button className="w-full bg-[#0d7bda] hover:bg-[#0a66b8] text-white py-3 px-4 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Створити гру
          </button>
        </Link>
        <Link to="/join" className="block">
          <button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-3 px-4 rounded transition-all duration-300 hover:scale-105 border border-[#3a3a3a]">
            Приєднатися до гри
          </button>
        </Link>
      </div>
    </div>
  );
}

function CreateGamePage({ createGame, wsLoading, gameState }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState?.roomId) {
      navigate(`/game/${gameState.roomId}`);
    }
  }, [gameState, navigate]);

  return <CreateGameForm createGame={createGame} wsLoading={wsLoading} />;
}

function JoinGamePage({ joinGame, wsLoading, gameState }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState?.roomId) {
      navigate(`/game/${gameState.roomId}`);
    }
  }, [gameState, navigate]);

  return <JoinGameForm joinGame={joinGame} wsLoading={wsLoading} />;
}

function JoinByLinkPage({ joinGame, wsLoading, gameState }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState?.roomId) {
      navigate(`/game/${gameState.roomId}`);
    }
  }, [gameState, navigate]);

  return <JoinByLinkForm joinGame={joinGame} wsLoading={wsLoading} />;
}

function App() {
  const { 
    createGame, 
    joinGame, 
    loading: wsLoading, 
    gameState,
    loadPackage,
    startGame,
    selectQuestion,
    buzzIn,
    correctAnswer,
    wrongAnswer,
    skipQuestion,
    nextQuestion,
    getSocketId
  } = useWebSocket();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage createGame={createGame} wsLoading={wsLoading} gameState={gameState} />} />
      <Route path="/join" element={<JoinGamePage joinGame={joinGame} wsLoading={wsLoading} gameState={gameState} />} />
      <Route path="/join-link" element={<JoinByLinkPage joinGame={joinGame} wsLoading={wsLoading} gameState={gameState} />} />
      <Route 
        path="/game/:gameId" 
        element={
          <GamePage 
            gameState={gameState}
            loadPackage={loadPackage}
            startGame={startGame}
            selectQuestion={selectQuestion}
            buzzIn={buzzIn}
            correctAnswer={correctAnswer}
            wrongAnswer={wrongAnswer}
            skipQuestion={skipQuestion}
            nextQuestion={nextQuestion}
            getSocketId={getSocketId}
          />
        } 
      />
    </Routes>
  );
}

export default App;

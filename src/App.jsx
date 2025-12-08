import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useWebSocket } from './hooks/createConnectionHook';
import CreateGameForm from './components/forms/createGameForm';
import JoinGameForm from './components/forms/joinGameForm';
import GamePage from './pages/GamePage';

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-sm w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Квіз</h1>
        <a href="/create" className="block mb-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Створити гру
          </button>
        </a>
        <a href="/join" className="block">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            Приєднатися до гри
          </button>
        </a>
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

function App() {
  const { createGame, joinGame, loading: wsLoading, gameState } = useWebSocket();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage createGame={createGame} wsLoading={wsLoading} gameState={gameState} />} />
      <Route path="/join" element={<JoinGamePage joinGame={joinGame} wsLoading={wsLoading} gameState={gameState} />} />
      <Route path="/game/:gameId" element={<GamePage gameState={gameState} />} />
    </Routes>
  );
}

export default App;

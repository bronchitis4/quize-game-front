import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useWebSocket } from './hooks/createConnectionHook';
import CreateGameForm from './components/forms/createGameForm';
import JoinGameForm from './components/forms/JoinGameForm';
import GamePage from './pages/GamePage';

function HomePage() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Квіз</h1>
      <a href="/create" style={{ display: 'block', marginBottom: '10px' }}>
        <button style={{ width: '100%', padding: '12px', fontSize: '16px', cursor: 'pointer' }}>
          Створити гру
        </button>
      </a>
      <a href="/join" style={{ display: 'block' }}>
        <button style={{ width: '100%', padding: '12px', fontSize: '16px', cursor: 'pointer' }}>
          Приєднатися до гри
        </button>
      </a>
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

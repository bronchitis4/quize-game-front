import { useParams } from 'react-router-dom';

const GamePage = ({ gameState }) => {
  const { gameId } = useParams();

  if (!gameState) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Гра не знайдена</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1>Гра: {gameId}</h1>
        <p>Статус: {gameState.status}</p>
      </div>

      {/* Main Game Area */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left: Players List */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Гравці ({gameState.players?.length || 0})</h3>
          <div>
            {gameState.players?.map(player => (
              <div key={player.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={player.avatarUrl} alt={player.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>{player.name}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {player.isHost ? '🏆 Хост' : `Рахунок: ${player.score}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Game Content */}
        <div style={{ flex: 2, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          {gameState.status === 'LOBBY' && (
            <div style={{ textAlign: 'center' }}>
              <h2>Очікування старту гри...</h2>
              <button style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
                Розпочати гру
              </button>
            </div>
          )}

          {gameState.status === 'IN_PROGRESS' && (
            <div>
              <h2>Поточне запитання</h2>
              <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px', marginTop: '15px' }}>
                <p>Запитання буде тут...</p>
              </div>
            </div>
          )}

          {gameState.status === 'ENDED' && (
            <div style={{ textAlign: 'center' }}>
              <h2>Гра закінчена!</h2>
              <p>Результати:</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
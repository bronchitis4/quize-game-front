import { useParams } from 'react-router-dom';

const GamePage = ({ gameState }) => {
  const { gameId } = useParams();

  if (!gameState) {
    return <div className="p-8">Гра не знайдена</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Гра: {gameId}</h1>
        <p className="mb-6">Статус: {gameState.status}</p>

        <div className="flex gap-6">
          <div className="flex-1 border p-4 rounded">
            <h3 className="font-bold mb-4">Гравці ({gameState.players?.length || 0})</h3>
            <div>
              {gameState.players?.map(player => (
                <div key={player.id} className="p-2 border-b flex items-center gap-2">
                  <img src={player.avatarUrl} alt={player.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-bold text-sm">{player.name}</p>
                    <p className="text-xs">{player.isHost ? 'Хост' : `Рахунок: ${player.score}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-2 border p-4 rounded">
            {gameState.status === 'LOBBY' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Очікування старту гри...</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                  Розпочати гру
                </button>
              </div>
            )}

            {gameState.status === 'IN_PROGRESS' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Поточне запитання</h2>
                <div className="bg-gray-100 p-4 rounded border">
                  <p>Запитання буде тут...</p>
                </div>
              </div>
            )}

            {gameState.status === 'ENDED' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Гра закінчена!</h2>
                <p>Результати:</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
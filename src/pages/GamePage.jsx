import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserBar from '../components/userbar/UserBar';
import gameSocketService from '../services/gameSocketService';

const GamePage = ({ gameState }) => {
  const { gameId } = useParams();
  const [packageLoaded, setPackageLoaded] = useState(!!gameState?.package);

  useEffect(() => {
    // Оновити статус паку при зміні gameState
    setPackageLoaded(!!gameState?.package);
  }, [gameState?.package]);

  if (!gameState) {
    return <div className="p-8">Гра не знайдена</div>;
  }

  const hostPlayer = gameState.players?.[0];
  const isPackageValid = gameState?.package?.categories && gameState.package.categories.length > 0;

  const handleUploadPack = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result);
            console.log('Завантажений пак:', jsonData);
            gameSocketService.loadPackage(gameId, jsonData);
            setPackageLoaded(true);
          } catch (error) {
            alert('Помилка при завантаженні JSON файлу');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex h-screen bg-gray-200 gap-2 p-2">
      <div className="w-40 bg-red-600 p-4 flex flex-col gap-3 border-4 border-red-700">
        {hostPlayer && (
          <>
            <div className="border-2 border-red-700 p-2 bg-red-700">
              <div className="w-full h-24 bg-green-500 flex items-center justify-center mb-0">
                <img src={hostPlayer.avatarUrl || "https://via.placeholder.com/96"} alt={hostPlayer.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full bg-gray-500 py-2 text-center">
                <p className="text-xs font-bold text-gray-800">{hostPlayer.name}</p>
              </div>
            </div>
            <div className="bg-gray-500 py-2 px-2 text-center text-xs font-bold text-gray-800">
              Ведучий
            </div>
            <button 
              className="bg-gray-500 py-2 px-2 text-xs font-bold text-gray-800 hover:bg-gray-600"
              onClick={handleUploadPack}
            >
              завантажити пак
            </button>
            {packageLoaded && isPackageValid ? (
              <div className="bg-green-500 py-2 px-2 text-center text-xs font-bold text-gray-800">
                Пак завантажений
              </div>
            ) : (
              <div className="bg-gray-400 py-2 px-2 text-center text-xs font-bold text-gray-800">
                Пака нема
              </div>
            )}
            <button className="bg-gray-500 py-2 px-2 text-xs font-bold text-gray-800 hover:bg-gray-600">
              Розпочати гру
            </button>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-red-600 flex-1 flex items-center justify-center border-4 border-red-700">
          {gameState.status === 'LOBBY' && (
            <div className="flex gap-8">
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          {gameState.status === 'IN_PROGRESS' && (
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Запитання буде тут...</h2>
            </div>
          )}
          {gameState.status === 'ENDED' && (
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Гра закінчена!</h2>
            </div>
          )}
        </div>

        <div className="bg-red-600 p-4 border-4 border-red-700">
          <div className="grid grid-cols-4 gap-4">
            {gameState.players?.filter((_, index) => index !== 0).map(player => (
              <UserBar key={player.id} name={player.name} avatarUrl={player.avatarUrl} score={player.score} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
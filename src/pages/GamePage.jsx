import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserBar from '../components/userbar/UserBar';
import GameBoard from '../components/gameboard/gameboard';
import QuestionView from '../components/question/QuestionView';
import Podium from '../components/podium/Podium';
import gameSocketService from '../services/gameSocketService';

const GamePage = ({ gameState }) => {
  const { gameId } = useParams();
  const [packageLoaded, setPackageLoaded] = useState(!!gameState?.package);

  useEffect(() => {
    setPackageLoaded(!!gameState?.package);
  }, [gameState?.package]);

  if (!gameState) {
    return <div className="p-8">Гра не знайдена</div>;
  }

  const hostPlayer = gameState.players?.[0];
  const isPackageValid = gameState?.package?.categories && gameState.package.categories.length > 0;
  const isHostLocal = gameState.players?.find(p => p.isHost)?.id === gameSocketService.getSocketId();
  const currentQuestion = gameState?.currentQuestion?.question;

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

  const handleStartGame = () => {
    gameSocketService.startGame(gameId);
  };

  return (
    <div className="flex h-screen bg-gray-200 gap-2 p-2">
      <div className="w-40 bg-blue-600 p-4 flex flex-col gap-3 border-4 border-blue-700">
        {hostPlayer && (
          <>
            <div className="border-2 border-blue-700 p-2 bg-blue-700">
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
            {gameState.status === 'LOBBY' && (
              <>
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
                <button 
                  className="bg-gray-500 py-2 px-2 text-xs font-bold text-gray-800 hover:bg-gray-600"
                  onClick={handleStartGame}
                >
                  Розпочати гру
                </button>
              </>
            )}

            {/* Host controls during active question */}
            {gameState.status === 'QUESTION_ACTIVE' && isHostLocal && currentQuestion && (
              <div className="mt-4">
                <div className="bg-yellow-500 text-black text-sm font-bold text-center py-1 rounded">{gameState.players?.find(p => p.id === (Array.isArray(gameState.currentAnswerer) ? gameState.currentAnswerer[0] : gameState.currentAnswerer))?.name} відповідає...</div>

                <div className="bg-green-900 p-3 rounded mt-3">
                  <div className="text-gray-300 text-xs">Правильна відповідь:</div>
                  <div className="text-white text-sm font-bold">{currentQuestion.answer}</div>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <button onClick={() => gameSocketService.correctAnswer(gameId, gameState.currentSelector)} className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded font-bold">✓ Зарахувати</button>
                  <button onClick={() => gameSocketService.wrongAnswer(gameId, gameState.currentSelector)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded font-bold">✗ Не зарахувати</button>
                  <button onClick={() => gameSocketService.skipQuestion(gameId)} className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-2 rounded font-bold">⏭ Пропустити</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-blue-600 flex-1 flex items-center justify-center border-4 border-blue-700">
          {gameState.status === 'LOBBY' && (
            <div className="flex gap-8">
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          {gameState.status === 'PLAYING' && (
            <GameBoard gameState={gameState} isHost={gameState.players?.find(p => p.isHost)?.id === gameSocketService.getSocketId()} />
          )}
          {gameState.status === 'QUESTION_ACTIVE' && (
            <QuestionView gameState={gameState} isHost={gameState.players?.find(p => p.isHost)?.id === gameSocketService.getSocketId()} />
          )}

          {gameState.status === 'FINISHED' && (
            <Podium players={gameState.players || []} />
          )}
          {gameState.status === 'ENDED' && (
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Гра закінчена!</h2>
            </div>
          )}
        </div>

        <div className="bg-blue-600 p-4 border-4 border-blue-700">
          <div className="grid grid-cols-4 gap-4">
            {gameState.players?.filter((_, index) => index !== 0).map(player => (
              <UserBar 
                key={player.id} 
                name={player.name} 
                avatarUrl={player.avatarUrl} 
                score={player.score}
                isCurrentSelector={player.id === gameState.currentAnswerer[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
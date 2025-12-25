import { useState } from 'react';

const HostSidebar = ({ gameState, gameId, isHost, loadPackage, startGame, correctAnswer, wrongAnswer, skipQuestion, buzzIn, getSocketId, nextQuestion }) => {
  const [packageLoaded, setPackageLoaded] = useState(!!gameState?.package);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const hostPlayer = gameState.players?.[0];
  const isPackageValid = gameState?.package?.categories && gameState.package.categories.length > 0;
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
            console.log('Package loaded:', jsonData);
            loadPackage(gameId, jsonData);
            setPackageLoaded(true);
          } catch (error) {
            alert('Error loading JSON file');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleStartGame = () => {
    startGame(gameId);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/join-link?gameId=${gameId}&password=${gameState.password}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  if (!hostPlayer) return null;

  const hasCurrentAnswererField = gameState && Object.prototype.hasOwnProperty.call(gameState, 'currentAnswerer');
  const currentAnswerer = gameState?.currentAnswerer;
  const bannedAnswerers = gameState?.bannedAnswerers || [];
  const myId = typeof getSocketId === 'function' ? getSocketId() : null;
  const isAnswererPresent = Array.isArray(currentAnswerer) ? currentAnswerer.length > 0 : !!currentAnswerer;
  const canBuzzIn = hasCurrentAnswererField && !bannedAnswerers.includes(myId) && !isAnswererPresent;

  return (
    <div className="w-40 bg-[#1a1a1a] p-4 flex flex-col gap-3 border-2 border-[#2a2a2a] rounded-lg">
      <div className="border-2 border-[#3a3a3a] p-2 bg-[#2a2a2a] rounded">
        <div className="w-full h-24 flex items-center justify-center mb-0 overflow-hidden rounded">
          <img 
            src={hostPlayer.avatarUrl || "https://via.placeholder.com/96"} 
            alt={hostPlayer.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="w-full bg-[#3a3a3a] py-2 text-center mt-2 rounded">
          <p className="text-xs font-bold text-white">{hostPlayer.name}</p>
        </div>
      </div>
      
      <div className="bg-[#0d7bda] py-2 px-2 text-center text-xs font-bold text-white rounded">
        Ведучий
      </div>


      {gameState.status === 'LOBBY' && isHost && (
        <>
          <button 
            className="bg-[#2a2a2a] py-2 px-2 text-xs font-bold text-white hover:bg-[#3a3a3a] transition-colors border border-[#3a3a3a] rounded"
            onClick={handleUploadPack}
          >
            завантажити пак
          </button>
          {packageLoaded && isPackageValid ? (
            <div className="bg-green-700 py-2 px-2 text-center text-xs font-bold text-white rounded">
              Пак завантажений
            </div>
          ) : (
            <div className="bg-[#3a3a3a] py-2 px-2 text-center text-xs font-bold text-gray-400 rounded">
              Пака нема
            </div>
          )}
          <button 
            className="bg-[#0d7bda] py-2 px-2 text-xs font-bold text-white hover:bg-[#0a66b8] transition-colors rounded"
            onClick={handleStartGame}
          >
            Розпочати гру
          </button>
        </>
      )}

       {gameState.status === 'LOBBY' && (
        <div className='flex flex-col gap-2'>
          <div className="bg-[#2a2a2a] p-3 rounded border border-[#3a3a3a]">
            <div className="text-gray-400 mb-1 text-xs">ID гри:</div>
            <div className="text-white font-mono text-xs font-bold break-all">{gameId}</div>
          </div>
          
          {isHost && (
            <button 
              className={`py-2 px-2 text-xs font-bold transition-colors rounded ${copySuccess ? 'bg-green-700 text-white' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-[#3a3a3a]'}`}
              onClick={handleCopyInviteLink}
            >
              {copySuccess ? 'Скопійовано!' : 'Посилання-запрошення'}
            </button>
          )}
        </div>
      )}

      {gameState.status === 'QUESTION_ACTIVE' && isHost && currentQuestion && (
        <div className="mt-4 h-[40vh] flex flex-col justify-between">
          <div className="bg-[#0d7bda] text-white text-xs font-bold text-center py-2 rounded">
            {gameState.players?.find(p => p.id === (Array.isArray(gameState.currentAnswerer) ? gameState.currentAnswerer[0] : gameState.currentAnswerer))?.name} відповідає...
          </div>

          <div className="p-3 rounded mt-3 bg-[#2a2a2a] border border-[#3a3a3a]">
            <div className="text-gray-400 text-xs text-center mb-2">Правильна відповідь:</div>
            <div className="text-white text-xs font-bold text-center">
              {typeof currentQuestion.answer === 'object' && currentQuestion.answer?.text 
                ? currentQuestion.answer.text 
                : typeof currentQuestion.answer === 'string' 
                  ? currentQuestion.answer 
                  : 'Див. медіа'}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <button 
              onClick={() => correctAnswer(gameId, gameState.currentSelector)} 
              className="bg-green-700 hover:bg-green-600 text-white px-2 py-2 rounded font-bold transition-colors text-xs"
            >
              Зарахувати
            </button>
            <button 
              onClick={() => wrongAnswer(gameId, gameState.currentSelector)} 
              className="bg-red-700 hover:bg-red-600 text-white px-2 py-2 rounded font-bold transition-colors text-xs"
            >
              Не зарахувати
            </button>
            <button 
              onClick={() => skipQuestion(gameId)} 
              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-2 py-2 rounded font-bold transition-colors border border-[#3a3a3a] text-xs"
            >
              Пропустити
            </button>
          </div>
        </div>
      )}
      {gameState.status === 'QUESTION_ACTIVE' && !isHost && hasCurrentAnswererField && (
        <div className="mt-4">
          <button
            onClick={() => buzzIn && buzzIn(gameId)}
            disabled={!canBuzzIn}
            className={
              `w-full bg-red-600 hover:bg-red-500 disabled:bg-[#3a3a3a] disabled:cursor-not-allowed text-white rounded-full py-4 text-3xl font-bold transition-all duration-300 shadow-2xl ` +
              (!canBuzzIn ? 'opacity-60' : '')
            }
          >
            !
          </button>
        </div>
      )}
      {gameState.status === 'ANSWER' && isHost && (
        <div className="mt-4">
          <button
            onClick={() => nextQuestion && nextQuestion(gameId)}
            className="w-full bg-[#2d5c2d] hover:bg-[#3d6d3d] text-white py-3 rounded font-bold transition-colors"
          >
            Наступне питання
          </button>
        </div>
      )}
    </div>
  );
};

export default HostSidebar;

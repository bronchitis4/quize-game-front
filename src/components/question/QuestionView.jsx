import gameSocketService from '../../services/gameSocketService';
import { useParams } from 'react-router-dom';

const QuestionView = ({ gameState, isHost }) => {
  const { gameId } = useParams();
  const currentQuestion = gameState?.currentQuestion?.question;
  const currentAnswerer = gameState?.currentAnswerer;
  const bannedAnswerers = gameState?.bannedAnswerers || [];
  const myId = gameSocketService.getSocketId();
  const hasCurrentAnswererField = gameState && Object.prototype.hasOwnProperty.call(gameState, 'currentAnswerer');
  const isAnswererPresent = Array.isArray(currentAnswerer) ? currentAnswerer.length > 0 : !!currentAnswerer;
  const canBuzzIn = hasCurrentAnswererField && !bannedAnswerers.includes(myId) && !isAnswererPresent;

  if (!currentQuestion) {
    return <div className="text-white text-2xl">Питання не знайдено</div>;
  }

  const handleBuzzIn = () => {
    gameSocketService.buzzIn(gameId);
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
  
      <div className="bg-blue-900 p-8 rounded-lg max-w-4xl w-full">
        <div className="text-yellow-400 text-2xl font-bold mb-4">
          {currentQuestion.points} очок
        </div>
        
        
        {currentQuestion.text && (
          <div className="text-white text-4xl font-bold text-center mb-4">
            {currentQuestion.text}
          </div>
        )}
        
        
        {currentQuestion.type === 'image' ? (
          <div className="flex justify-center">
            <img 
              src={currentQuestion.content} 
              alt="Питання" 
              className="max-w-full max-h-96 rounded-lg"
            />
            {currentQuestion.text && (
              <div className="text-white text-4xl font-bold text-center mt-4">
                {currentQuestion.text}
              </div>
            )}
          </div>
        ) : currentQuestion.type === 'video' ? (
          <div className="flex justify-center">
            <video 
              src={currentQuestion.content} 
              controls 
              className="max-w-full max-h-96 rounded-lg"
            />
          </div>
        ) : currentQuestion.type === 'text' && !currentQuestion.text ? (
          <div className="text-white text-4xl font-bold text-center">
            {currentQuestion.content}
          </div>
        ) : currentQuestion.type === 'audio' ? (
          <div className="flex justify-center">
            <audio
              src={currentQuestion.content}
              controls
              className="max-w-full rounded-lg"
            />
            {currentQuestion.text && (
              <div className="text-white text-4xl font-bold text-center mt-4">
                {currentQuestion.text}
              </div>
            )}
          </div>
        ) : null}
      </div>

      
      {!isHost && hasCurrentAnswererField && (
        <button
          onClick={handleBuzzIn}
          disabled={!canBuzzIn}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-12 py-6 rounded-lg text-2xl font-bold transition-colors"
        >
          {isAnswererPresent ? 'Хтось відповідає...' : bannedAnswerers.includes(myId) ? 'Ви вже відповіли неправильно' : '🔔 Відповісти'}
        </button>
      )}
    </div>
  );
};

export default QuestionView;

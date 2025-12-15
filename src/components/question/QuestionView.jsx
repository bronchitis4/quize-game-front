import gameSocketService from '../../services/gameSocketService';
import { useParams } from 'react-router-dom';

const QuestionView = ({ gameState, isHost }) => {
  const { gameId } = useParams();
  const currentQuestion = gameState?.currentQuestion?.question;

  if (!currentQuestion) {
    return <div className="text-white text-2xl">Питання не знайдено</div>;
  }

  const handleAcceptAnswer = () => {
    gameSocketService.correctAnswer(gameId, gameState.currentSelector);
  };

  const handleRejectAnswer = () => {
    gameSocketService.wrongAnswer(gameId, gameState.currentSelector);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
      {/* Питання */}
      <div className="bg-blue-900 p-8 rounded-lg max-w-4xl w-full">
        <div className="text-yellow-400 text-2xl font-bold mb-4">
          {currentQuestion.points} очок
        </div>
        
        {/* Текст питання */}
        {currentQuestion.text && (
          <div className="text-white text-4xl font-bold text-center mb-4">
            {currentQuestion.text}
          </div>
        )}
        
        {/* Відображення контенту в залежності від типу */}
        {currentQuestion.type === 'image' ? (
          <div className="flex justify-center">
            <img 
              src={currentQuestion.content} 
              alt="Питання" 
              className="max-w-full max-h-96 rounded-lg"
            />
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
        ) : null}
      </div>

      {/* Кнопки та відповідь для хоста */}
      {isHost && (
        <div className="flex flex-col gap-4 items-center">
          <div className="bg-green-900 p-6 rounded-lg">
            <div className="text-gray-300 text-sm mb-2">Правильна відповідь:</div>
            <div className="text-white text-2xl font-bold">{currentQuestion.answer}</div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleAcceptAnswer}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-bold transition-colors"
            >
              ✓ Зарахувати
            </button>
            <button
              onClick={handleRejectAnswer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-bold transition-colors"
            >
              ✗ Не зарахувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionView;

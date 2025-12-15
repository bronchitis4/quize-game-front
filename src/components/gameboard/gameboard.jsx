import gameSocketService from '../../services/gameSocketService';
import { useParams } from 'react-router-dom';

const GameBoard = ({ gameState, isHost }) => {
  const { gameId } = useParams();
  const categories = gameState?.package?.categories || [];
  const maxQuestions = Math.max(...categories.map(cat => cat.questions?.length || 0), 5);

  const handleQuestionSelect = (categoryIndex, questionIndex) => {
    if (isHost) {
      gameSocketService.selectQuestion(gameId, categoryIndex, questionIndex);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 p-2">
      <div className="grid gap-1 w-full h-full" style={{ gridTemplateColumns: `300px repeat(${maxQuestions}, 1fr)`, gridTemplateRows: `repeat(${categories.length}, 1fr)` }}>
       
        {/* Rows: category name + questions */}
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="contents">
            {/* Category name */}
            <div className="bg-blue-800 border-2 border-black flex items-center justify-center p-4">
              <span className="text-white font-bold text-3xl text-center uppercase leading-tight">{category.title}</span>
            </div>
            
            {/* Question buttons */}
            {Array.from({ length: maxQuestions }).map((_, qIndex) => {
              const question = category.questions?.[qIndex];
              
              if (!question) {
                return (
                  <div
                    key={qIndex}
                    className="bg-blue-800 border-2 border-black"
                  />
                );
              }
              
              return (
                <button
                  key={qIndex}
                  className="bg-blue-800 hover:bg-blue-700 border-2 border-black flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={question?.answered || !isHost}
                  onClick={() => handleQuestionSelect(catIndex, qIndex)}
                >
                  <span className="text-yellow-400 font-bold text-6xl">{question.points}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
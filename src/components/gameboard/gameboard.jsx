const GameBoard = ({ gameState, isHost, selectQuestion, gameId }) => {
  const categories = gameState?.package?.categories || [];
  const maxQuestions = Math.max(...categories.map(cat => cat.questions?.length || 0), 5);
  const gridMinWidth = `${180 + maxQuestions * 120}px`; // approximate min width to allow horizontal scrolling when many columns

  const handleQuestionSelect = (categoryIndex, questionIndex) => {
    if (isHost) {
      selectQuestion(gameId, categoryIndex, questionIndex);
    }
  };

  return (
    <div className="w-full h-full min-w-0 screen900:p-4">
      <div className="overflow-x-auto lg:overflow-x-hidden w-full h-full">
        <div
          className="grid gap-1 screen900:gap-4 h-full"
          style={{
            minWidth: gridMinWidth,
            gridTemplateColumns: `minmax(100px,180px) repeat(${maxQuestions}, minmax(60px,1fr))`,
            gridTemplateRows: `repeat(${categories.length}, minmax(60px,1fr))`,
          }}
        >
       
        {/* Rows: category name + questions */}
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="contents">
            {/* Category name */}
              <div className="bg-[#18181b] border-2 border-[#232324] flex items-center justify-center p-1 screen900:p-4 rounded-lg shadow-md">
              <span className="text-white font-bold text-sm screen900:text-2xl text-center uppercase leading-tight">{category.title}</span>
            </div>
            
            {/* Question buttons */}
            {Array.from({ length: maxQuestions }).map((_, qIndex) => {
              const question = category.questions?.[qIndex];
              
              if (!question) {
                return (
                  <div
                    key={qIndex}
                    className="bg-[#111112] border-2 border-[#232324] rounded-lg"
                  />
                );
              }
              
              return (
                <button
                  key={qIndex}
                  className="bg-[#232324] hover:bg-[#18181b] border-2 border-[#232324] flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-30 rounded-lg shadow-md"
                  disabled={question?.answered || !isHost}
                  onClick={() => handleQuestionSelect(catIndex, qIndex)}
                >
                  <span className="text-yellow-300 font-bold text-xl screen900:text-4xl 2xl:text-7xl">{question.points}</span>
                </button>
              );
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
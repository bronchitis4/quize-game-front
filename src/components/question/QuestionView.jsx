import { useState, useRef, useEffect } from 'react';

const convertGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Checking if this is a GitHub link with a blob
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  
  return url;
};

const QuestionView = ({ gameState, isHost, buzzIn, gameId, getSocketId }) => {
  const currentQuestion = gameState?.currentQuestion?.question;
  const currentAnswerer = gameState?.currentAnswerer;
  const bannedAnswerers = gameState?.bannedAnswerers || [];
  const myId = getSocketId();
  const hasCurrentAnswererField = gameState && Object.prototype.hasOwnProperty.call(gameState, 'currentAnswerer');
  const isAnswererPresent = Array.isArray(currentAnswerer) ? currentAnswerer.length > 0 : !!currentAnswerer;
  const canBuzzIn = hasCurrentAnswererField && !bannedAnswerers.includes(myId) && !isAnswererPresent;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const playedQuestions = useRef(new Set());
  const currentQuestionId = `${gameState?.currentQuestion?.categoryIndex}-${gameState?.currentQuestion?.questionIndex}`;

  useEffect(() => {
    if (currentQuestion?.type === 'audio') {
      // Check if this question has already been played
      if (!playedQuestions.current.has(currentQuestionId)) {
        // Start the countdown automatically when the audio question loads
        setCountdown(3);
        setIsPlaying(false);
      } else {
        // Start the countdown automatically when the audio question loads
        setCountdown(null);
        setIsPlaying(false);
      }
    }
  }, [currentQuestion, currentQuestionId]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && audioRef.current && !playedQuestions.current.has(currentQuestionId)) {
      // Countdown is over, play audio once
      audioRef.current.play();
      setIsPlaying(true);
      playedQuestions.current.add(currentQuestionId); // Add only after playback
      setCountdown(null);
    }
  }, [countdown, currentQuestionId]);

  if (!currentQuestion) {
    return <div className="text-white text-2xl">Питання не знайдено</div>;
  }

  const handleBuzzIn = () => {
    buzzIn(gameId);
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
  
      <div className="rounded-lg w-full h-full flex flex-col bg-[#2a2a2a] border-2 border-[#3a3a3a]">
        <div className="bg-[#0d7bda] text-white text-center  text-3xl font-bold p-4">
          {currentQuestion.points} очок
        </div>
            
        {currentQuestion.type === 'image' ? (
          <div
            className="flex justify-center items-center flex-1 relative"
            style={{
              backgroundImage: `url(${convertGitHubUrl(currentQuestion.content)})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '40vh',
            }}
          >
            {currentQuestion.text && (
              <div className="text-black text-2xl screen900:text-3xl 2xl:text-4xl font-bold text-center bg-white bg-opacity-70 px-8 py-4 rounded-lg shadow-lg">
                {currentQuestion.text}
              </div>
            )}
          </div>
        ) : currentQuestion.type === 'video' ? (
          <div className="flex justify-center flex-col w-full flex-1">
            <video 
              src={convertGitHubUrl(currentQuestion.content)} 
              controls 
              className="w-full h-full rounded-lg"
            />
            {currentQuestion.text && (
              <div className="text-white text-2xl screen900:text-3xl 2xl:text-4xl font-bold text-center mt-6">
                {currentQuestion.text}
              </div>
            )}
          </div>
        
        ) : currentQuestion.type === 'text' && !currentQuestion.text ? (
          <div className="text-white text-2xl screen900:text-3xl 2xl:text-4xl font-bold text-center flex-1 flex items-center justify-center p-4 screen900:p-8 px-4 break-words whitespace-pre-wrap">
            {currentQuestion.content}
          </div>
        ) : currentQuestion.type === 'audio' ? (
          <div className="flex justify-center flex-col items-center w-full flex-1">
            <div className="w-full h-full flex justify-center items-center">
              <audio
                ref={audioRef}
                src={convertGitHubUrl(currentQuestion.content)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              {countdown !== null && countdown > 0 ? (
                <div className="text-white text-5xl screen900:text-6xl 2xl:text-5xl font-bold animate-pulse">
                  {countdown}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                      {isPlaying ? (
                    <div className="flex gap-4">
                      <div className="w-4 h-16 bg-[#0d7bda] animate-pulse rounded"></div>
                      <div className="w-4 h-16 bg-[#0d7bda] animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-4 h-16 bg-[#0d7bda] animate-pulse rounded" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                      ) : playedQuestions.current.has(currentQuestionId) ? (
                    <div className="text-white text-3xl screen900:text-4xl 2xl:text-3xl font-bold">Пім пім патапум...</div>
                  ) : null}
                </div>
              )}
            </div>
            {currentQuestion.text && (
              <div className="text-white text-5xl font-bold text-center bg-[#1a1a1a] p-8 w-full mt-6 rounded">
                {currentQuestion.text}
              </div>
            )}
          </div>
        ) : null}
      </div>      
    </div>
  );
};

export default QuestionView;

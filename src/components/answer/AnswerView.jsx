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

const AnswerView = ({ gameState, isHost, nextQuestion, gameId }) => {
  const currentQuestion = gameState?.currentQuestion?.question;
  const answer = currentQuestion?.answer;
  const audioRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Automatically play background music if there is one
    if (answer?.backgroundMusic && backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(err => {
        console.log('Autoplay blocked:', err);
      });
    }

    // Stopping the music when dismantling a component
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, [answer?.backgroundMusic]);

  if (!currentQuestion || !answer) {
    return <div className="text-white text-2xl"></div>;
  }

  const handleNextQuestion = () => {
    nextQuestion(gameId);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {answer?.backgroundMusic && (
        <audio
          ref={backgroundMusicRef}
          src={convertGitHubUrl(answer.backgroundMusic)}
          loop
          className="hidden"
        />
      )}
      
      {/* Showing the correct answer */}
      <div className="rounded-lg w-full h-full flex flex-col bg-[#2a2a2a] border-2 border-[#3a3a3a] overflow-hidden">
        <div className="bg-[#2d5c2d] text-white text-center rounded-t-lg text-3xl font-bold p-4">
          Правильна відповідь
        </div>
            
        {answer.type === 'image' ? (
          <>
            <div
              className="flex justify-center items-center flex-1 relative rounded-lg shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${convertGitHubUrl(answer.content)})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '40vh',
              }}
            >
              {answer.text && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="text-white text-5xl font-bold text-center px-8 py-4 rounded-lg"
                    style={{ WebkitTextStroke: '2px black', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
                  >
                    {answer.text}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : answer.type === 'video' ? (
          <div className="flex justify-center items-center flex-1">
            <video 
              src={convertGitHubUrl(answer.content)} 
              controls 
              autoPlay
              className="max-w-full max-h-[60vh]"
              style={{height: '100%', objectFit: 'contain'}}
            />
          </div>
        ) : answer.type === 'text' && !answer.text ? (
          <div className="text-white text-5xl font-bold text-center p-8 flex-1 flex items-center justify-center">
            {answer.content}
          </div>
        ) : answer.type === 'audio' ? (
          <div className="flex justify-center items-center flex-1">
            <audio
              ref={audioRef}
              src={convertGitHubUrl(answer.content)}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              onClick={toggleAudio}
              className="bg-[#0d7bda] hover:bg-[#0a66b8] text-white rounded-full w-32 h-32 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110"
            >
              {isPlaying ? (
                <div className="flex gap-3">
                  <div className="w-3 h-12 bg-white rounded"></div>
                  <div className="w-3 h-12 bg-white rounded"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[18px] border-t-transparent border-b-[18px] border-b-transparent ml-2"></div>
              )}
            </button>
          </div>
        ) : answer.text ? (
          <div className="text-white text-5xl font-bold text-center p-8 flex-1 flex items-center justify-center">
            {answer.text}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AnswerView;

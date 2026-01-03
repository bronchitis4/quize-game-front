import UserBar from '../userbar/UserBar';

const PlayersBar = ({ players, currentAnswerer }) => {
  const nonHostPlayers = players?.filter((_, index) => index !== 0) || [];

  return (
    <div className="bg-[#1a1a1a] px-4 py-2 screen900:px-4 lg:px-4 xl:px-6 2xl:px-6 border-2 border-[#2a2a2a] rounded-lg w-full max-w-full">
      <div className="w-full max-w-full overflow-x-auto">
        <div className="flex gap-3 flex-nowrap min-h-[80px]" style={{width: 'max-content'}}>
          {nonHostPlayers.map(player => (
            <UserBar
              key={player.id}
              name={player.name}
              avatarUrl={player.avatarUrl}
              score={player.score}
              isCurrentSelector={player.id === (Array.isArray(currentAnswerer) ? currentAnswerer[0] : currentAnswerer)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayersBar;

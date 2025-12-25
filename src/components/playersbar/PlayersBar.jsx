import UserBar from '../userbar/UserBar';

const PlayersBar = ({ players, currentAnswerer }) => {
  const nonHostPlayers = players?.filter((_, index) => index !== 0) || [];

  return (
    <div className="bg-[#1a1a1a] p-1 screen900:p-4 lg:p-4 xl:p-6 2xl:p-6 border-2 border-[#2a2a2a] rounded-lg">
      <div className="grid grid-cols-6 screen900:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-1 screen900:gap-4 lg:gap-4 xl:gap-6 2xl:gap-6">
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
  );
};

export default PlayersBar;

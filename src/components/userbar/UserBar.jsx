
const UserBar = ({name, avatarUrl, score, isCurrentSelector}) => {
  return (
    <div className={`flex flex-col items-center ${isCurrentSelector ? 'border-4 border-green-500' : ''}`}>
      <div className="w-24 h-24 bg-green-500 flex items-center justify-center mb-0">
        <img src={avatarUrl || "https://via.placeholder.com/96"} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="w-24 bg-gray-500 py-2 text-center">
        <p className="text-sm font-bold text-gray-800">{name}</p>
      </div>
      <p className="text-sm text-gray-700 py-1">{score}</p>
    </div>
  )
}

export default UserBar;
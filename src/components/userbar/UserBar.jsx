

const UserBar = ({name, avatarUrl, score, isCurrentSelector}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={
        `w-6 h-6 screen900:w-24 screen900:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 ` +
        (isCurrentSelector ? 'border-2 screen900:border-4 lg:border-4 xl:border-4 2xl:border-4 border-[#0d7bda] ring-2 screen900:ring-4 lg:ring-4 xl:ring-4 2xl:ring-4 ring-[#0d7bda]/30' : 'border border-[#2a2a2a] screen900:border-2') +
        ' flex items-center justify-center mb-0 rounded-lg overflow-hidden'
      }>
        <img src={avatarUrl || "https://via.placeholder.com/96"} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="w-8 py-0.5 text-[8px] mt-1 screen900:w-24 screen900:py-2 screen900:text-xs screen900:mt-2 lg:screen900:w-28 lg:screen900:py-2 xl:w-32 xl:py-2 2xl:w-36 bg-[#2a2a2a] text-center rounded">
        <p className="font-bold text-white truncate">{name}</p>
      </div>
      <p className="text-[10px] py-0 screen900:text-sm screen900:py-1 2xl:text-base text-yellow-300 font-bold">{score}</p>
    </div>
  )
}

export default UserBar;
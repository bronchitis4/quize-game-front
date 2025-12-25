import React from 'react';

const Podium = ({ players = [] }) => {
  const sorted = players.filter(player => player.isHost !== true).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  const [first, second, third, ...rest] = sorted;

  return (
    <div className="w-full h-full overflow-x-auto screen900:overflow-x-visible px-4 screen900:px-0 flex flex-col items-center justify-center gap-8 p-8 bg-[#0f0f0f]">
      <div className="w-full max-w-md screen900:max-w-5xl overflow-x-visible flex-nowrap flex items-end justify-start gap-3 screen900:gap-6 screen900:justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] text-white font-bold text-xl w-40 h-28 flex items-center justify-center rounded-t-lg overflow-hidden">
            {second ? (
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${second.avatarUrl || 'https://via.placeholder.com/160'})` }} />
            ) : ''}
          </div>
          <div className="bg-gray-400 text-black font-bold text-2xl w-40 h-20 flex items-center justify-center rounded-b-lg">2</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#2a2a2a] border-2 border-[#0d7bda] text-white font-bold text-2xl w-48 h-40 flex items-center justify-center rounded-t-lg overflow-hidden">
            {first ? (
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${first.avatarUrl || 'https://via.placeholder.com/192'})` }} />
            ) : ''}
          </div>
          <div className="bg-yellow-400 text-black font-bold text-4xl w-48 h-28 flex items-center justify-center rounded-b-lg">1</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] text-white font-bold text-xl w-40 h-28 flex items-center justify-center rounded-t-lg overflow-hidden">
            {third ? (
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${third.avatarUrl || 'https://via.placeholder.com/160'})` }} />
            ) : ''}
          </div>
          <div className="bg-orange-600 text-white font-bold text-2xl w-40 h-20 flex items-center justify-center rounded-b-lg">3</div>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="text-white text-2xl font-bold mb-4 text-center">Таблиця результатів</h3>
        <ul className="flex flex-col gap-3">
          {sorted.map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] py-3 pl-3 pr-5 rounded-lg">
              <div className="flex items-center gap-3">
                <img src={p.avatarUrl || 'https://via.placeholder.com/48'} alt={p.name} className="w-10 h-10 object-cover rounded" />
                <div className="text-white font-semibold">{idx + 1}. {p.name}</div>
              </div>
              <div className="text-yellow-300 font-bold">{p.score || 0}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Podium;

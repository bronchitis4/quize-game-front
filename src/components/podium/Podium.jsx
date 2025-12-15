import React from 'react';

const Podium = ({ players = [] }) => {
  const sorted = players.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  const [first, second, third, ...rest] = sorted;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
      <div className="w-full max-w-5xl flex items-end justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className="bg-blue-800 text-white font-bold text-xl w-40 h-28 flex items-center justify-center rounded-t-md">{second ? second.name : ''}</div>
          <div className="bg-yellow-400 text-black font-bold text-2xl w-40 h-20 flex items-center justify-center">2</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-blue-900 text-white font-bold text-2xl w-48 h-40 flex items-center justify-center rounded-t-md">{first ? first.name : ''}</div>
          <div className="bg-yellow-400 text-black font-bold text-4xl w-48 h-28 flex items-center justify-center">1</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-blue-800 text-white font-bold text-xl w-40 h-28 flex items-center justify-center rounded-t-md">{third ? third.name : ''}</div>
          <div className="bg-yellow-400 text-black font-bold text-2xl w-40 h-20 flex items-center justify-center">3</div>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="text-white text-2xl font-bold mb-4 text-center">Таблиця результатів</h3>
        <ul className="space-y-2">
          {sorted.map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between bg-blue-700 p-3 rounded">
              <div className="flex items-center gap-3">
                <img src={p.avatarUrl || 'https://via.placeholder.com/48'} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
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

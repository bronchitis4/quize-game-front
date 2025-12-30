import { useState } from 'react';
import defaultProfile from '../../assets/profile/profile.jpg';

const JoinGameForm = ({ joinGame, wsLoading }) => {
  const [step, setStep] = useState('profile');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [gameId, setGameId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введіть ім\'я');
      return;
    }
    // Якщо не вибрано аватар, використовуємо стандартний
    setStep('join');
    setError('');
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!gameId.trim()) {
      setError('Введіть ID гри');
      return;
    }
    if (!password.trim()) {
      setError('Введіть пароль');
      return;
    }
    // Якщо не вибрано аватар, використовуємо стандартний
    const avatarToSend = avatarPreview || defaultProfile;
    joinGame(name, avatarToSend, gameId, password);
  };

  if (step === 'profile') {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-[#0f0f0f]">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-lg border border-[#2a2a2a] animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-white">Приєднатися до гри</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-[#e0e0e0]">Ім'я:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white focus:outline-none focus:border-[#0d7bda]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[#e0e0e0]">Аватар:</label>
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-[#e0e0e0] focus:outline-none focus:border-[#0d7bda]"
              />
            </div>

            <div className="text-center">
              <img src={avatarPreview || defaultProfile} alt="Preview" className="w-20 h-20 rounded-full mx-auto border-2 border-[#0d7bda]" />
            </div>

            {error && <div className="text-red-400 text-sm p-2 border border-red-900 rounded bg-red-950">{error}</div>}

            <button type="submit" className="w-full bg-[#0d7bda] hover:bg-[#0a66b8] text-white py-3 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Далі
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#0f0f0f]">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-bold mb-6 text-white">Приєднатися до гри</h2>
        <form onSubmit={handleJoinGame} className="space-y-4">
          <div className="text-center mb-4">
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-[#0d7bda]" />
            )}
            <p className="font-bold text-white">{name}</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#e0e0e0]">ID гри:</label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Скопіюйте ID з хостера"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#0d7bda]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#e0e0e0]">Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white focus:outline-none focus:border-[#0d7bda]"
            />
          </div>

          {error && <div className="text-red-400 text-sm p-2 border border-red-900 rounded bg-red-950">{error}</div>}

          <button type="submit" disabled={wsLoading} className="w-full bg-[#0d7bda] hover:bg-[#0a66b8] disabled:bg-[#3a3a3a] text-white py-3 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100">
            {wsLoading ? 'Приєднання...' : 'Приєднатися'}
          </button>
          <button
            type="button"
            onClick={() => setStep('profile')}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] py-3 rounded text-white transition-all duration-300 border border-[#3a3a3a]"
          >
            Назад
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGameForm;

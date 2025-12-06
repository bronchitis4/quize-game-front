import { useState } from 'react';

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
    if (!avatar) {
      setError('Завантажте аватар');
      return;
    }
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
    joinGame(name, avatarPreview, gameId, password);
  };

  if (step === 'profile') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Приєднатися до гри</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1">Ім'я:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Аватар:</label>
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {avatarPreview && (
              <div className="text-center">
                <img src={avatarPreview} alt="Preview" className="w-20 h-20 rounded-full mx-auto" />
              </div>
            )}

            {error && <div className="text-red-600 text-sm p-2 border border-red-300 rounded bg-red-50">{error}</div>}

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
              Далі
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Приєднатися до гри</h2>
        <form onSubmit={handleJoinGame} className="space-y-3">
          <div className="text-center mb-4">
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full mx-auto mb-2" />
            )}
            <p className="font-bold">{name}</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">ID гри:</label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Скопіюйте ID з хостера"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {error && <div className="text-red-600 text-sm p-2 border border-red-300 rounded bg-red-50">{error}</div>}

          <button type="submit" disabled={wsLoading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded">
            {wsLoading ? 'Приєднання...' : 'Приєднатися'}
          </button>
          <button
            type="button"
            onClick={() => setStep('profile')}
            className="w-full bg-gray-300 hover:bg-gray-400 py-2 rounded"
          >
            Назад
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGameForm;

import { useState, useEffect } from 'react';
import defaultProfile from '../../assets/profile/profile.jpg';
import { useSearchParams, useNavigate } from 'react-router-dom';

const JoinByLinkForm = ({ joinGame, wsLoading }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');

  const gameId = searchParams.get('gameId');
  const password = searchParams.get('password');

  useEffect(() => {
    if (!gameId || !password) {
      setError('Невірне посилання запрошення');
    }
  }, [gameId, password]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введіть ім\'я');
      return;
    }
    if (!gameId || !password) {
      setError('Невірне посилання запрошення');
      return;
    }
    // Якщо не вибрано аватар, використовуємо стандартний
    const avatarToSend = avatarPreview || defaultProfile;
    joinGame(name, avatarToSend, gameId, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#0f0f0f]">
      <div className="w-full max-w-sm bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-bold mb-4 text-white">Приєднання до гри</h2>
      
        <form onSubmit={handleJoinGame} className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1 text-[#e0e0e0]">Ім'я:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white focus:outline-none focus:border-[#0d7bda]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-[#e0e0e0]">Аватар:</label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-[#e0e0e0] focus:outline-none focus:border-[#0d7bda]"
            />
          </div>

          <div className="text-center">
            <img src={avatarPreview || defaultProfile} alt="Preview" className="w-20 h-20 rounded-full mx-auto border-2 border-[#0d7bda]" />
          </div>

          {error && <div className="text-red-400 text-sm p-2 border border-red-900 rounded bg-red-950">{error}</div>}

          <button 
            type="submit" 
            disabled={wsLoading || !gameId || !password} 
            className="w-full bg-[#0d7bda] hover:bg-[#0a66b8] disabled:bg-[#3a3a3a] text-white py-2 rounded transition-colors"
          >
            {wsLoading ? 'Приєднання...' : 'Приєднатися до гри'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] py-2 rounded text-white transition-colors border border-[#3a3a3a]"
          >
            На головну
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinByLinkForm;

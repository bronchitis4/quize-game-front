import { useState } from 'react';
import defaultProfile from '../../assets/profile/profile.jpg';
import { saveLastGameData } from '../../utils/localGameData';

const CreateGameForm = ({ createGame, wsLoading }) => {
  const [step, setStep] = useState('profile'); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
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
      // If no avatar is selected, use default
    setStep('password');
    setError('');
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('Мін. 4 символи');
      return;
    }
      // If no avatar is selected, use default
    const avatarToSend = avatarPreview || defaultProfile;
    createGame(name, avatarToSend, password);
      // Save last game data to localStorage
    const lastGameData = {
      nickname: name,
      avatar: avatarToSend,
      password,
        // id will be added after game creation (see GamePage)
    };
    saveLastGameData(lastGameData);
  };

  if (step === 'profile') {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-[#0f0f0f]">
        <div className="w-full max-w-md flex flex-col gap-4 items-center bg-[#1a1a1a] p-8 rounded-lg border border-[#2a2a2a] animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 text-white">Створити гру</h2>
            <div className="text-center flex justify-center">
              <img src={avatarPreview || defaultProfile} alt="Preview" className="w-20 h-20 rounded-full mx-auto border-2 border-[#0d7bda]" />
            </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4 w-full">
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
      <div className="w-full max-w-md flex flex-col flex-center gap-4 bg-[#1a1a1a] p-8 rounded-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">Пароль гри</h2>
        <form onSubmit={handleCreateGame} className="space-y-4 w-full">
          <div className="text-center mb-4 flex items-center flex-col">
            <img src={avatarPreview || defaultProfile} alt="Avatar" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-[#0d7bda]" />
            <p className="font-bold text-white">{name}</p>
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

          <button type="submit" disabled={wsLoading} className="w-full bg-[#0d7bda] hover:bg-[#0a66b8] disabled:bg-[#3a3a3a] text-white py-3 rounded transition-colors">
            {wsLoading ? 'Створення...' : 'Захостити гру'}
          </button>
          <button
            type="button"
            onClick={() => setStep('profile')}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] py-3 rounded text-white transition-colors border border-[#3a3a3a]"
          >
            Назад
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGameForm;

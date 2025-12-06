import { useState } from 'react';
import { useWebSocket } from '../../hooks/createConnectionHook';

export default function Connection({ onConnect }) {
  const { createGame, joinGame, loading, error: wsError } = useWebSocket();
  const [step, setStep] = useState('profile');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [password, setPassword] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Введіть нік');
      return;
    }
    if (!avatar) {
      setError('Завантажте аватар');
      return;
    }
    setStep('mode');
    setError('');
  };

  const handleSetPassword = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Введіть пароль');
      return;
    }
    if (password.length < 4) {
      setError('Мін. 4 символи');
      return;
    }
    createGame(nickname, avatarPreview, password);
    onConnect({ nickname, avatar, avatarPreview, mode: 'host', password, gameId: null });
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
    joinGame(nickname, avatarPreview, gameId, password);
    onConnect({ nickname, avatar, avatarPreview, mode: 'join', password, gameId });
  };

  if (step === 'profile') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
        <h2>Профіль</h2>
        <form onSubmit={handleProfileSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Нік:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Аватар:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {avatarPreview && (
            <div style={{ marginBottom: '15px' }}>
              <img src={avatarPreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            </div>
          )}

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {wsError && <div style={{ color: 'red', marginBottom: '10px' }}>{wsError}</div>}

          <button type="submit" style={{ width: '100%', padding: '10px' }}>Далі</button>
        </form>
      </div>
    );
  }

  if (step === 'mode') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
        <h2>Режим</h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {avatarPreview && (
            <img src={avatarPreview} alt={nickname} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          )}
          <p>{nickname}</p>
        </div>

        <button
          onClick={() => setStep('password')}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        >
          Захостити гру
        </button>
        <button
          onClick={() => setStep('join')}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        >
          Приєднатись
        </button>
        <button
          onClick={() => setStep('profile')}
          style={{ width: '100%', padding: '10px' }}
        >
          Назад
        </button>
      </div>
    );
  }

  if (step === 'join') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
        <h2>Приєднання до гри</h2>
        <form onSubmit={handleJoinGame}>
          <div style={{ marginBottom: '15px' }}>
            <label>ID гри:</label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {wsError && <div style={{ color: 'red', marginBottom: '10px' }}>{wsError}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
            {loading ? 'Приєднання...' : 'Приєднатись'}
          </button>
          <button
            type="button"
            onClick={() => setStep('mode')}
            style={{ width: '100%', padding: '10px' }}
          >
            Назад
          </button>
        </form>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
        <h2>Пароль гри</h2>
        <form onSubmit={handleSetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {wsError && <div style={{ color: 'red', marginBottom: '10px' }}>{wsError}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
            {loading ? 'Створення...' : 'Захостити'}
          </button>
          <button
            type="button"
            onClick={() => setStep('mode')}
            style={{ width: '100%', padding: '10px' }}
          >
            Назад
          </button>
        </form>
      </div>
    );
  }
}

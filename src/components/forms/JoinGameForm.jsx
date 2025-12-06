import { useState } from 'react';

const JoinGameForm = ({ joinGame, wsLoading }) => {
  const [step, setStep] = useState('profile'); // profile, join
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
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
        <h2>Приєднатися до гри</h2>
        <form onSubmit={handleProfileSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Ім'я:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Аватар:</label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {avatarPreview && (
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <img src={avatarPreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            </div>
          )}

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <button type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px' }}>
            Далі
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
      <h2>Приєднатися до гри</h2>
      <form onSubmit={handleJoinGame}>
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }} />
          )}
          <p style={{ fontWeight: 'bold' }}>{name}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ID гри:</label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Скопіюйте ID з хостера"
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" disabled={wsLoading} style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}>
          {wsLoading ? 'Приєднання...' : 'Приєднатися'}
        </button>
        <button
          type="button"
          onClick={() => setStep('profile')}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        >
          Назад
        </button>
      </form>
    </div>
  );
};

export default JoinGameForm;

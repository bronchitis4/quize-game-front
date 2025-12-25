const InviteInfo = ({ gameId, onCopyLink, copySuccess }) => {
  const handleCopyId = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-4">Запросити гравців</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">ID гри:</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={gameId} 
            readOnly 
            className="flex-1 px-3 py-2 border rounded font-mono bg-gray-50"
          />
          <button
            onClick={handleCopyId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Копіювати
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Або поділіться посиланням:</p>
        <button
          onClick={onCopyLink}
          className={`w-full py-3 rounded font-bold text-white ${
            copySuccess ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {copySuccess ? '✓ Посилання скопійовано!' : '🔗 Скопіювати посилання-запрошення'}
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        <p>💡 Гравці можуть приєднатися:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Відкривши посилання-запрошення (простіше)</li>
          <li>Ввівши ID гри та пароль вручну</li>
        </ul>
      </div>
    </div>
  );
};

export default InviteInfo;
